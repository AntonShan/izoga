import https from "node:https";
import path from "node:path";
import { accessSync, createWriteStream, mkdirSync, openSync } from "node:fs";
import unzipper from "unzipper";
import bent from "bent";
import {
    minionFileDetails,
    minionFileDownloadUrl,
    minionFileDownloadUrl2,
    minionFileList,
} from "./minion.constants";
import { toAddonDetails, toAddonSummary } from "./minion.utils";
import { AddonSummary, MinionFileDetailsResponse, MinionFileShortResponse } from "./minion.types";
import { injectable } from "inversify";

@injectable()
export class MinionService {
    private readonly getJSON = bent("json");

    async listAddons() {
        const data = await this.getJSON(minionFileList());
        return (data as MinionFileShortResponse).map(toAddonSummary);
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
        // const downloadUrl = minionFileDownloadUrl(addon.id, fileName);

        console.log(`Downloading file ${fileName}...`);

        return new Promise((resolve, reject) => {
            https.get(downloadUrl, (response) => {
                response
                    .pipe(unzipper.Parse())
                    .on("entry", function (entry) {
                        if (!entry.path.startsWith(addon.name)) return;
                        const fileName = entry.path;
                        const destination = path.resolve(destinationPath, "AddOns", fileName);
                        if (entry.type === "File") {
                            const type = entry.type; // 'Directory' or 'File'
                            const size = entry.vars.uncompressedSize; // There is also compressedSize;
                            console.log(`${fileName}: ${type} - ${size}`);
                            mkdirSync(path.dirname(destination), { recursive: true });
                            entry.pipe(
                                createWriteStream(destination),
                                // createWriteStream(destination, {
                                //     fd: openSync(destination, "w+"),
                                // }),
                            );
                        }
                    })
                    .promise()
                    .catch(reject)
                    .then(resolve);
            });
        });
    }
}
