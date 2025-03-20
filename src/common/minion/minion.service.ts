import { createWriteStream, mkdirSync } from "node:fs";
import https from "node:https";
import path from "node:path";

import { injectable } from "inversify";
import { fetch } from "undici";
import unzipper from "unzipper";

import { minionFileDetails, minionFileDownloadUrl2, minionFileList } from "./minion.constants";
import type {
    AddonSummary,
    AddonSummary2,
    MinionFileDetailsResponse,
    MinionFileShortResponse,
} from "./minion.types";
import { toAddonDetails, toAddonSummary, toAddonSummary2 } from "./minion.utils";

@injectable()
export class MinionService {
    private async getJSON(url: string) {
        const response = await fetch(url);
        return response.json();
    }

    async listAddons() {
        const data = await this.getJSON(minionFileList());
        return (data as MinionFileShortResponse).map(toAddonSummary);
    }

    async listAddons2() {
        const data = await this.getJSON(minionFileList());
        return (data as MinionFileShortResponse)
            .map(toAddonSummary)
            .reduce((acc: AddonSummary2[], addon): AddonSummary2[] => {
                acc.push(
                    ...addon.ids.map(
                        (id): AddonSummary2 => ({
                            id,
                            name: addon.name,
                            version: addon.version,
                            fileInfoUrl: addon.fileInfoUrl,
                        }),
                    ),
                );
                return acc;
            }, []);
    }

    async getAddonDetails(id: string) {
        const data = await this.getJSON(minionFileDetails(id));
        const addonData = (data as MinionFileDetailsResponse).map(toAddonDetails).at(0);

        if (!addonData) {
            throw new Error("Addon details request returned to data");
        }

        return addonData;
    }

    async download(addon: AddonSummary, destinationPath: string) {
        const { fileName, date } = await this.getAddonDetails(addon.id);
        const downloadUrl = minionFileDownloadUrl2(addon.id, date);

        console.log(`Downloading file ${fileName}...`);

        return new Promise((resolve, reject) => {
            https.get(downloadUrl, (response) => {
                response
                    .pipe(unzipper.Parse())
                    .on("entry", function (entry) {
                        if (!addon.ids.every((id) => entry.path.startsWith(id))) {
                            return;
                        }
                        const fileName = entry.path;
                        const destination = path.resolve(destinationPath, "AddOns", fileName);
                        if (entry.type === "File") {
                            const type = entry.type; // 'Directory' or 'File'
                            const size = entry.vars.uncompressedSize; // There is also compressedSize;
                            console.log(`${fileName}: ${type} - ${size}`);
                            mkdirSync(path.dirname(destination), { recursive: true });
                            entry.pipe(createWriteStream(destination).on("error", reject));
                        }
                    })
                    .promise()
                    .catch(reject)
                    .then(resolve);
            });
        });
    }
}
