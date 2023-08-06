import { resolve } from "node:path";
import { access, constants, readdir, readFile } from "node:fs/promises";
import { MetadataParserService, type AddonMetadata } from "../metadata-parser";

export async function getInstalledAddons(path: string): Promise<AddonMetadata[]> {
    const resolvedPath = resolve(path);
    const addonsFolderPath = resolve(resolvedPath, "AddOns");
    const addons = await readdir(addonsFolderPath);
    const metadataParserService = new MetadataParserService();
    const addonManifests: AddonMetadata[] = [];

    for await (const addon of addons) {
        const manifestFilePath = resolve(addonsFolderPath, addon, `${addon}.txt`);

        try {
            await access(manifestFilePath, constants.R_OK);
            const file = await readFile(manifestFilePath);

            const parsedManifest = metadataParserService.parse(addon, file.toString("utf-8"));
            addonManifests.push(parsedManifest);
        } catch (e) {
            console.log(`Manifest for addon ${addon} doesn't exist or cannot be read. Skipping`);
        }
    }

    return addonManifests;
}
