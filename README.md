# Izoga

A console application to do some stuff with ESO addons that's not provided by Minion

## Currently available commands

- missing - display list of missing dependencies
- unused - display list of unused libraries

At the moment both commands accept only path to the folder containing UserSettings.txt file. Usually it's one of two:
- %Documents%\Elder Scrolls Online\live
- %Documents%\Elder Scrolls Online\pts

## How to define command

Create a class extending `CommandInterface` and decorate it `Command` decorator. You can optionally decorate it with `Description` decorator to explain what this command does
To define parameters for the command, decorate arguments of `execute` function with `Parameter` decorator. At the moment, only string, number and boolean types are allowed.
Example: 
```ts
    @Command("missing")
    @Description("List missing addon dependencies")
    export class ListMissing implements CommandInterface {
        async execute(
            @Parameter("path", { type: "string" }) path: string,
            @Parameter("optional", { type: "boolean", optional: true }) optional: boolean,
        ): Promise<void> {}
    }
```

This example defines command `missing` that has two arguments: `path` and `optional`

In the end, command must be registered. To do that, add your class to an array of commands in `src/main.ts`
```ts
    bootstrap([
        ListMissing
    ]);
```
