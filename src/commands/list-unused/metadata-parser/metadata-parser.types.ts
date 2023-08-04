export type PrimitiveValue = string | number | boolean;

export type AddonMetadata = {
    title: string;
    apiVersion: string[];
    version: string;
    savedVariables: string[];
    author: string[];
    description: string;
    dependsOn: DetailedAddonDependency[];
    optionalDependsOn: DetailedAddonDependency[];
    isLibrary: boolean;
    sourceFiles: string[];
    additionalMeta: Record<string, PrimitiveValue>;
};

export type MetaProperty = keyof Omit<AddonMetadata, "additionalMeta" | "sourceFiles">;

export enum VersionSelector {
    greaterThan = "gt",
    lessThan = "lt",
    equals = "eq",
}

export type AddonDependency = string | DetailedAddonDependency;

export type DetailedAddonDependency = {
    name: string;
    version?: string;
    versionSelector?: VersionSelector;
};
