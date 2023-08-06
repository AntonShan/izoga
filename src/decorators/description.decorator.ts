import { COMMAND_DESCRIPTION_METADATA_KEY } from "../types/metadata";

export function Description(description: string): ClassDecorator {
    return function (target) {
        Reflect.defineMetadata(COMMAND_DESCRIPTION_METADATA_KEY, description, target);
        return target;
    };
}
