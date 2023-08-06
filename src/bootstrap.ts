import yargs, { ArgumentsCamelCase } from "yargs";
import { hideBin } from "yargs/helpers";
import { Constructable } from "./types/constructible.type";
import {
    COMMAND_DESCRIPTION_METADATA_KEY,
    COMMAND_NAME_METADATA_KEY,
    COMMAND_PARAMETERS_METADATA_KEY,
} from "./types/metadata";
import { ParameterOptions } from "./decorators";

export function bootstrap(commands: Constructable[]) {
    return commands
        .reduce(
            (yargs, Command) => {
                if (!Reflect.hasOwnMetadata(COMMAND_NAME_METADATA_KEY, Command)) {
                    throw new Error(`${Command.name} is not annotated with Command decorator`);
                }

                const commandName = Reflect.getOwnMetadata(COMMAND_NAME_METADATA_KEY, Command);
                const commandDescription =
                    Reflect.getOwnMetadata(COMMAND_DESCRIPTION_METADATA_KEY, Command) ?? "";
                const commandParameters: ParameterOptions[] =
                    Reflect.getOwnMetadata(
                        COMMAND_PARAMETERS_METADATA_KEY,
                        Command.prototype,
                        "execute",
                    ) ?? [];
                const commandString = buildCommandString(commandName, commandParameters);
                const commandInstance = new Command();

                const handler = (argv: ArgumentsCamelCase) => {
                    const commandArguments = commandParameters.map(
                        (parameter, index): null | string | number | boolean => {
                            const rawParameterValue = argv[parameter.name];

                            if (rawParameterValue === null || rawParameterValue === undefined) {
                                if (parameter.optional !== true) {
                                    throw new Error(
                                        `Command ${commandName} is missing required parameter ${parameter.name} at position ${index}`,
                                    );
                                }
                            }

                            if (parameter.type === "number") {
                                // @ts-ignore
                                return parseFloat(rawParameterValue);
                            }

                            if (parameter.type === "boolean") {
                                return Boolean(rawParameterValue);
                            }

                            if (parameter.type === "string") {
                                return String(rawParameterValue);
                            }

                            return null;
                        },
                    );

                    return commandInstance.execute(...commandArguments);
                };

                return yargs.command(
                    commandString,
                    commandDescription,
                    (yargs) => {
                        commandParameters.reduce((yargs, parameter) => {
                            const options = {
                                type: parameter.type,
                                describe: parameter.describe,
                            };
                            if (parameter.optional) {
                                return yargs.option(parameter.name, options);
                            }
                            return yargs.positional(parameter.name, options);
                        }, yargs);
                    },
                    handler,
                );
            },
            yargs(hideBin(process.argv)),
        )
        .help()
        .parse();
}

function buildCommandString(name: string, parameters: ParameterOptions[]): string {
    const parametersString = parameters
        .filter((parameter) => !parameter.optional)
        .map((parameter) => (parameter.optional ? `[${parameter.name}]` : `<${parameter.name}>`))
        .join(" ");

    return `${name} ${parametersString}`;
}
