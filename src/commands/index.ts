import { AddProfileCommand } from "./add-profile.command";
import { ListMissing } from "./list-missing.command";
import { ListUnused } from "./list-unused.command";
import { ProfilesCommand } from "./profiles.command";
import { RemoveProfileCommand } from "./remove-profile.command";
import { SetDefaultCommand } from "./set-default.command";
import { RemoveUnusedCommand } from "./remove-unused.command";
import { InstallMissingCommand } from "./install-missing.command";

export const commands = [
    AddProfileCommand,
    RemoveProfileCommand,
    ProfilesCommand,
    SetDefaultCommand,
    ListMissing,
    ListUnused,
    RemoveUnusedCommand,
    InstallMissingCommand,
];
