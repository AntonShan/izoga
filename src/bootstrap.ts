import yargs, { ArgumentsCamelCase, Options, PositionalOptions } from "yargs";
import { hideBin } from "yargs/helpers";
import { Constructable } from "./types/constructible.type";
import {
    COMMAND_DESCRIPTION_METADATA_KEY,
    COMMAND_NAME_METADATA_KEY,
    COMMAND_PARAMETERS_METADATA_KEY,
} from "./types/metadata";
import { ParameterOptions } from "./decorators";
import { createContainer } from "./internals/container";
import { Container } from "inversify";

export function bootstrap(commands: Constructable[]) {
    const container = createContainer();

    return commands
        .reduce(
            (yargs, Command) => {
                if (!Reflect.hasOwnMetadata(COMMAND_NAME_METADATA_KEY, Command)) {
                    throw new Error(`${Command.name} is not annotated with Command decorator`);
                }

                const { commandName, commandDescription, commandParameters } =
                    getCommandMetadata(Command);

                container.bind(Command).toSelf();
                const commandString = buildCommandString(commandName, commandParameters);

                const handler = buildHandler(Command, container, commandName, commandParameters);

                return yargs.command(
                    commandString,
                    commandDescription,
                    (yargs) => {
                        commandParameters.reduce((yargs, parameter) => {
                            const options: Options = {
                                type: parameter.type,
                                description: parameter.description,
                                default: parameter.defaultValue,
                                demandOption: !parameter.optional,
                            };
                            if (parameter.optional) {
                                return yargs.option(parameter.name, options);
                            }
                            return yargs.positional(parameter.name, options as PositionalOptions);
                        }, yargs);
                    },
                    handler,
                );
            },
            yargs(hideBin(process.argv)),
        )
        .version("0.0.1")
        .help()
        .parse();
}

function getCommandMetadata(Command: Constructable) {
    const commandName = Reflect.getOwnMetadata(COMMAND_NAME_METADATA_KEY, Command);
    const commandDescription =
        Reflect.getOwnMetadata(COMMAND_DESCRIPTION_METADATA_KEY, Command) ?? "";
    const commandParameters: ParameterOptions[] =
        Reflect.getOwnMetadata(COMMAND_PARAMETERS_METADATA_KEY, Command.prototype, "execute") ?? [];

    return {
        commandName,
        commandDescription,
        commandParameters,
    };
}

function resolveCommandDependencies(Command: Constructable, container: Container) {
    const constructorParameters = Reflect.getMetadata("design:paramtypes", Command);

    if (constructorParameters === undefined) {
        console.warn(`Constructor ${Command.name} is not annotated with injectable decorator`);
        return new Command();
    }

    const instances = constructorParameters.map((parameter) => container.get(parameter));

    return new Command(...instances);
}

function buildCommandString(name: string, parameters: ParameterOptions[]): string {
    if (parameters.length === 0) return name;

    const parametersString = parameters
        .map((parameter) => {
            if (parameter.optional) {
                if (parameter.type === "boolean") {
                    return `[--${parameter.name}]`;
                }
                return `[${parameter.name}]`;
            } else {
                return `<${parameter.name}>`;
            }
        })
        .join(" ");

    return `${name} ${parametersString}`;
}

function buildHandler(
    Command: Constructable,
    container: Container,
    commandName: string,
    commandParameters: ParameterOptions[],
) {
    return function (argv: ArgumentsCamelCase) {
        const commandInstance = resolveCommandDependencies(Command, container);

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
}
