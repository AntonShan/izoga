import {
    type AddonMetadata,
    DetailedAddonDependency,
    type MetaProperty,
} from "./metadata-parser.types";
import {
    COMMENT_LINE,
    EMPTY_LINE_CHECK,
    META_LINE_KEYWORD,
    META_LINE_REGEX,
} from "./metadata-parser.constants";
import { EsoAddonMetadata } from "./eso-addon-metadata";

const stringValue =
    (
        key: MetaProperty,
        accessor: (value: string) => AddonMetadata[typeof key] = (value) => value,
    ) =>
    (value: string): [MetaProperty, AddonMetadata[typeof key]] => [key, accessor(value)];
const bool = (key: MetaProperty) => stringValue(key, (v) => v === "true");
const arrayOfValues = (key: MetaProperty) => stringValue(key, (v) => v.split(/,?\s+/));
const dependenciesArray = (key: MetaProperty) =>
    stringValue(key, (v) =>
        v
            .split(/,?\s+/)
            .map((dependency) => EsoAddonMetadata.parseDependencyString(dependency))
            .filter(Boolean),
    );

export class MetadataParserService {
    private readonly propertyMap: Record<string, ReturnType<typeof stringValue>> = {
        Title: stringValue("title"),
        APIVersion: arrayOfValues("apiVersion"),
        Version: stringValue("version"),
        SavedVariables: arrayOfValues("savedVariables"),
        Author: arrayOfValues("author"),
        Description: stringValue("description"),
        DependsOn: dependenciesArray("dependsOn"),
        OptionalDependsOn: dependenciesArray("optionalDependsOn"),
        IsLibrary: bool("isLibrary"),
    };

    parse(name: string, input: string): AddonMetadata {
        const result = new EsoAddonMetadata();
        result.metadata.name = name;

        for (const rawLine of input.split(/\n/)) {
            const line = rawLine.trim();
            if (EMPTY_LINE_CHECK.test(line) || COMMENT_LINE.test(line)) continue;
            if (!line.startsWith(META_LINE_KEYWORD)) {
                result.metadata.sourceFiles.push(line);
                continue;
            }

            const match = line.match(META_LINE_REGEX);
            if (match === null) continue;

            const [, property, value] = match;

            if (property === undefined || value === undefined) continue;

            if (property in this.propertyMap && typeof this.propertyMap[property] === "function") {
                const [targetProperty, transformedValue] = this.propertyMap[property]!(value);

                if (Reflect.has(result.metadata, targetProperty)) {
                    if (Array.isArray(result.metadata[targetProperty])) {
                        (result.metadata[targetProperty] as DetailedAddonDependency[]).push(
                            ...(transformedValue as DetailedAddonDependency[]),
                        );
                    }
                } else {
                    Reflect.set(result.metadata, targetProperty, transformedValue);
                }
            } else {
                Reflect.set(result.metadata.additionalMeta, property, value);
            }
        }

        return result.metadata;
    }
}
