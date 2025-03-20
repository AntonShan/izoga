import { AddProfileCommand } from "./add-profile.command";
import { InstallMissingCommand } from "./install-missing.command";
import { InstalledCommand } from "./installed.command";
import { ListMissing } from "./list-missing.command";
import { ListUnused } from "./list-unused.command";
import { OutdatedCommand } from "./outdated.command";
import { ProfilesCommand } from "./profiles.command";
import { RemoveProfileCommand } from "./remove-profile.command";
import { RemoveUnusedCommand } from "./remove-unused.command";
import { SetDefaultCommand } from "./set-default.command";

export const commands = [
    InstalledCommand,
    AddProfileCommand,
    RemoveProfileCommand,
    ProfilesCommand,
    SetDefaultCommand,
    ListMissing,
    ListUnused,
    RemoveUnusedCommand,
    InstallMissingCommand,
    OutdatedCommand,
];
