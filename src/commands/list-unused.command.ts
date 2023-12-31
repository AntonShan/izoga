import { CommandInterface } from "../types/command.interface";
import { Command, Description, Parameter } from "../decorators";
import { injectable } from "inversify";
import { AddonsService } from "../common/addons";
import { StoreService } from "../common/store";

@Command("unused")
@injectable()
@Description("list unused addons in path")
export class ListUnused implements CommandInterface {
    constructor(
        private readonly addonsService: AddonsService,
        private readonly storeService: StoreService,
    ) {}

    async execute(@Parameter("name", { type: "string" }) name: string): Promise<void> {
        const profile = await this.storeService.getProfile(name);
        const addons = await this.addonsService.getUnusedAddons(profile.path);
        console.log(addons.map((addon) => addon.name).join("\n"));
    }
}
