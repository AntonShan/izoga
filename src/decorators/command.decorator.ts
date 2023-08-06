import { COMMAND_NAME_METADATA_KEY } from "../types/metadata";

export function Command(name: string): ClassDecorator {
    return function (target) {
        Reflect.defineMetadata(COMMAND_NAME_METADATA_KEY, name, target);
    };
}
