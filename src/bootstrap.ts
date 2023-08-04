import yargs, { ArgumentsCamelCase } from "yargs";
import { hideBin } from "yargs/helpers";
import {
    COMMAND_DESCRIPTION_METADATA_KEY,
    COMMAND_NAME_METADATA_KEY,
    COMMAND_PARAMETERS_METADATA_KEY,
    CommandParameter,
} from "./decorators/command.decorator";
import { Constructable } from "./types/constructible.type";

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
                const commandParameters: CommandParameter[] =
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

                            if (typeof rawParameterValue !== "string") {
                                if (parameter.optional === true) {
                                    throw new Error(
                                        `Command ${commandName} is missing required parameter ${parameter.name} at position ${index}`,
                                    );
                                }
                                return null;
                            }

                            if (parameter.type === "number") {
                                return parseFloat(rawParameterValue);
                            }

                            if (parameter.type === "boolean") {
                                return Boolean(rawParameterValue);
                            }

                            return rawParameterValue;
                        },
                    );

                    return commandInstance.execute(...commandArguments);
                };

                return yargs.command(
                    commandString,
                    commandDescription,
                    (yargs) => {
                        commandParameters.reduce((yargs, parameter) => {
                            return yargs.positional(parameter.name, {
                                type: parameter.type,
                                describe: parameter.describe,
                            });
                        }, yargs);
                    },
                    handler,
                );
            },
            yargs(hideBin(process.argv)),
        )
        .parse();
}

function buildCommandString(name: string, parameters: CommandParameter[]): string {
    const parametersString = parameters
        .map((parameter) => (parameter.optional ? `[${parameter.name}]` : `<${parameter.name}>`))
        .join(" ");

    return `${name} ${parametersString}`;
}
