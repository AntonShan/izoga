import { AddCommand } from "./add.command";
import { ListMissing } from "./list-missing.command";
import { ListUnused } from "./list-unused.command";
import { ProfilesCommand } from "./profiles.command";
import { RemoveCommand } from "./remove.command";

export const commands = [AddCommand, RemoveCommand, ProfilesCommand, ListMissing, ListUnused];
