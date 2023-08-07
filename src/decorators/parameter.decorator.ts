import { COMMAND_PARAMETERS_METADATA_KEY } from "../types/metadata";

export type ParameterOptions = {
    name: string;
    description?: string;
    defaultValue?: any;
    optional?: boolean;
    type: "boolean" | "number" | "string";
};

export function Parameter(name: string, data: Omit<ParameterOptions, "name">): ParameterDecorator {
    return function (target, propertyKey, parameterIndex) {
        if (!propertyKey) {
            throw new Error("No propertyKey");
        }

        const existingParameters: ParameterOptions[] =
            Reflect.getOwnMetadata(COMMAND_PARAMETERS_METADATA_KEY, target, propertyKey) ?? [];
        existingParameters[parameterIndex] = {
            name,
            ...data,
        };
        Reflect.defineMetadata(
            COMMAND_PARAMETERS_METADATA_KEY,
            existingParameters,
            target,
            propertyKey,
        );
        return target;
    };
}
