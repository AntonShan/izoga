export type CommandParameter = {
    name: string;
    describe?: string;
    optional?: boolean;
    type: "boolean" | "number" | "string";
};

export const COMMAND_NAME_METADATA_KEY = Symbol("__command:name");
export const COMMAND_DESCRIPTION_METADATA_KEY = Symbol("__command:description");
export const COMMAND_PARAMETERS_METADATA_KEY = Symbol("__command:parameters");

export function Command(name: string): ClassDecorator {
    return function (target) {
        Reflect.defineMetadata(COMMAND_NAME_METADATA_KEY, name, target);
    };
}

export function Description(description: string): ClassDecorator {
    return function (target) {
        Reflect.defineMetadata(COMMAND_DESCRIPTION_METADATA_KEY, description, target);
    };
}

export function Parameter(name: string, data: Omit<CommandParameter, "name">): ParameterDecorator {
    return function (target, propertyKey, parameterIndex) {
        if (!propertyKey) {
            throw new Error("gay");
        }

        const existingParameters: CommandParameter[] =
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
    };
}
