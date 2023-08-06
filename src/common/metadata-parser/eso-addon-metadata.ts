import { type AddonMetadata, type DetailedAddonDependency } from "./metadata-parser.types";
import { ADDON_WITH_VERSION, versionSelectorMap } from "./metadata-parser.constants";

export class EsoAddonMetadata {
    readonly metadata: AddonMetadata = {
        name: "",
        additionalMeta: {},
        apiVersion: [],
        author: [],
        dependsOn: [],
        description: "",
        optionalDependsOn: [],
        savedVariables: [],
        sourceFiles: [],
        title: "",
        version: "",
        isLibrary: false,
    };

    addDependency(dependencies: string[]) {
        dependencies.forEach((dependency) => {
            this.addToDependencyArray(this.metadata.dependsOn, dependency);
        });
        return this;
    }

    addOptionalDependency(dependencies: string[]) {
        dependencies.map((dependency) => {
            this.addToDependencyArray(this.metadata.optionalDependsOn, dependency);
        });
        return this;
    }

    private addToDependencyArray(dependencyArray: DetailedAddonDependency[], dependency: string) {
        const parsedDependency = EsoAddonMetadata.parseDependencyString(dependency);
        if (parsedDependency !== null) dependencyArray.push(parsedDependency);

        console.error("Incorrect dependency");
    }

    static parseDependencyString(dependency: string): DetailedAddonDependency | null {
        const dependencyInfo = dependency.match(ADDON_WITH_VERSION);
        if (dependencyInfo === null) {
            console.error("incorrect dependency info");
            return null;
        }

        const [, addonName, rawVersionSelector, version] = dependencyInfo;

        if (!addonName) {
            return null;
        }

        if (!rawVersionSelector || !version) {
            return { name: addonName };
        }

        if (!versionSelectorMap.has(rawVersionSelector)) {
            console.error(
                `incorrect dependency format info - unknown version selector: ${rawVersionSelector}`,
            );
            return null;
        }

        return {
            name: addonName,
            version,
            versionSelector: versionSelectorMap.get(rawVersionSelector),
        };
    }
}
