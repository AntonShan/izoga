# Izoga

A console application to do some stuff with ESO addons that's not provided by Minion

## Currently available commands

  - `profile-add` <path> <name>          Register profile
  - `profile-remove` <name>              Remove profile. Removes just profile, leaving files as is
  - `profiles`                           List exising profiles
  - `set-default` <name>                 Remembers selected profile as default. Doesn't affect anything at the moment
  - `missing` <name> [--optional]        List missing addon dependencies
  - `unused` <name>                      list unused addons in path
  - `remove-unused` <name>               list unused addons in path
  - `install-missing` <name>             Installs missing addon dependencies

At the moment both commands accept only path to the folder containing UserSettings.txt file. Usually it's one of two:
- %Documents%\Elder Scrolls Online\live
- %Documents%\Elder Scrolls Online\pts

## How to use

  1. Register addons path using `profile add`. For example `izoga profile add "C:\Users\Username\Documents\Elder Scrolls Online\live" live`. If path has spaces it must be put inside double quotes
  1. `izoga install-missing live` to install addons that are required but not installed currently

Also:

  - You may want to add Izoga to PATH to call it from whatever directory you want
  - You may also want to see what Izoga can do. Do `izoga --help` to see full list of available commands


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

## File system imprint

Izoga saves its db file to `%APPDATA%/Local/izoga/store.db`. It contains only list of registered profiles and profile selected as default
