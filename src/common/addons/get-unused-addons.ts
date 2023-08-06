import { getInstalledAddons } from "./get-installed-addons";
import { AddonMetadata } from "../metadata-parser";

export async function getUnusedAddons(path: string): Promise<AddonMetadata[]> {
    const addons = await getInstalledAddons(path);

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
