import { getInstalledAddons } from "./get-installed-addons";
import { AddonMetadata } from "../metadata-parser";

export async function getMissingAddons(
    path: string,
    includeOptional = false,
): Promise<AddonMetadata[]> {
    const addons = await getInstalledAddons(path);
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

    return addons.filter((addon) => missingAddons.has(addon.name));
}
