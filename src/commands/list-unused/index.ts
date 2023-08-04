import { resolve } from "node:path";
import { readdir, readFile, access, constants } from "node:fs/promises";
import { MetadataParserService } from "./metadata-parser/metadata-parser.service";
import { CommandInterface } from "../../types/command.interface";
import { Command, Description, Parameter } from "../../decorators/command.decorator";

@Command("list-unused")
@Description("list unused addons in path")
export class ListUnused implements CommandInterface {
    async execute(@Parameter("path", { type: "string" }) path: string): Promise<void> {
        const resolvedPath = resolve(path);
        const addonsFolderPath = resolve(resolvedPath, "AddOns");
        const addons = await readdir(addonsFolderPath);
        const metadataParserService = new MetadataParserService();

        const dependencyMap = new Map<string, number>();

        for await (const addon of addons) {
            const manifestFilePath = resolve(addonsFolderPath, addon, `${addon}.txt`);

            try {
                await access(manifestFilePath, constants.R_OK);
                const file = await readFile(resolve(addonsFolderPath, addon, `${addon}.txt`));

                const parsedManifest = metadataParserService.parse(file.toString("utf-8"));

                if (parsedManifest.isLibrary) {
                    dependencyMap.set(addon, dependencyMap.get(addon) ?? 0);
                }

                [...parsedManifest.dependsOn, ...parsedManifest.optionalDependsOn].forEach(
                    (dependency) => {
                        const dependsCount = dependencyMap.get(dependency.name) ?? 0;
                        dependencyMap.set(dependency.name, dependsCount + 1);
                    },
                );
            } catch (e) {
                console.log(`Manifest for addon ${addon} doesn't exist. Skipping`);
            }
        }

        console.log(
            Array.from(dependencyMap.entries())
                .filter(([addon, depends]) => depends === 0)
                .map(([addon]) => addon)
                .join("\n"),
        );
    }
}
