import { injectable } from "inversify";
import { AddonMetadata, MetadataParserService } from "../metadata-parser";
import { resolve, basename, extname } from "node:path";
import { constants } from "node:fs";
import { access, readFile, rm } from "node:fs/promises";
import { glob } from "glob";

@injectable()
export class AddonsService {
    async getInstalledAddons(path: string): Promise<AddonMetadata[]> {
        const resolvedPath = resolve(path);
        const addonsFolderPath = resolve(resolvedPath, "AddOns");
        const metadataFilePaths = await glob(`${addonsFolderPath}/**/*.txt`, {
            absolute: true,
            windowsPathsNoEscape: true,
            ignore: {
                ignored: (p) => {
                    const fileName = basename(p.name, ".txt");
                    return fileName !== p.parent?.name;
                },
            },
        });
        const metadataParserService = new MetadataParserService();
        const addonManifests: AddonMetadata[] = [];

        for await (const metadataFilePath of metadataFilePaths) {
            const manifestFilePath = resolve(metadataFilePath);

            try {
                await access(manifestFilePath, constants.R_OK);
                const file = await readFile(manifestFilePath);
                const addonName = basename(metadataFilePath, extname(metadataFilePath));

                const parsedManifest = metadataParserService.parse(
                    addonName,
                    file.toString("utf-8"),
                );
                addonManifests.push(parsedManifest);
            } catch (e) {
                console.log(
                    `Manifest for addon ${metadataFilePath} doesn't exist or cannot be read. Skipping`,
                );
            }
        }

        return addonManifests;
    }

    async getMissingAddons(path: string, includeOptional = false): Promise<string[]> {
        const addons = await this.getInstalledAddons(path);
        const addonsSet = new Set(addons.map((addon) => addon.name));

        const missingAddons = new Set<string>();

        addons.forEach((addon) => {
            addon.dependsOn.forEach((dependency) => {
                if (!addonsSet.has(dependency.name)) {
                    missingAddons.add(dependency.name);
                }
            });
            if (includeOptional) {
                addon.optionalDependsOn.forEach((dependency) => {
                    if (!addonsSet.has(dependency.name)) {
                        missingAddons.add(dependency.name);
                    }
                });
            }
        });

        return Array.from(missingAddons);
    }

    async getUnusedAddons(path: string): Promise<AddonMetadata[]> {
        const addons = await this.getInstalledAddons(path);

        const dependencyMap = new Map<string, number>();

        for await (const addon of addons) {
            if (addon.isLibrary) {
                dependencyMap.set(addon.name, dependencyMap.get(addon.name) ?? 0);
            }

            [...addon.dependsOn, ...addon.optionalDependsOn].forEach((dependency) => {
                const dependsCount = dependencyMap.get(dependency.name) ?? 0;
                dependencyMap.set(dependency.name, dependsCount + 1);
            });
        }

        const unusedAddonNames = new Set(
            Array.from(dependencyMap.entries())
                .filter(([, depends]) => depends === 0)
                .map(([addon]) => addon),
        );

        return addons.filter((addon) => unusedAddonNames.has(addon.name));
    }

    async removeUnusedAddons(profilePath: string, addons: AddonMetadata[]) {
        for await (const addon of addons) {
            const addonFolder = resolve(profilePath, "AddOns", addon.name);
            await access(addonFolder);
            await rm(addonFolder, {
                recursive: true,
            });
            console.log(addonFolder);
        }
    }
}
