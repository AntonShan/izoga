export type PrimitiveValue = string | number | boolean;

export interface AddonMetadata extends Record<string, unknown> {
    name: string;
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
}

export type MetaProperty = keyof Omit<AddonMetadata, "additionalMeta" | "sourceFiles">;

export enum VersionSelector {
    greaterThan = "gt",
    lessThan = "lt",
    equals = "eq",
}

export type AddonDependency = string | DetailedAddonDependency;

export interface DetailedAddonDependency {
    name: string;
    version?: string;
    versionSelector?: VersionSelector;
}
