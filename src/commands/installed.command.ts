import { injectable } from "inversify";

import { AddonsService } from "../common/addons";
import { StoreService } from "../common/store";
import { Command, Parameter } from "../decorators";
import { type CommandInterface } from "../types/command.interface";

@Command("installed")
@injectable()
export class InstalledCommand implements CommandInterface {
    constructor(
        private readonly storeService: StoreService,
        private readonly addonsService: AddonsService,
    ) {}

    async execute(@Parameter("name", { type: "string" }) name: string): Promise<void> {
        try {
            const profile = await this.storeService.getProfile(name);
            const addons = await this.addonsService.getInstalledAddons(profile.path);

            console.log(addons.map((addon) => addon.name).join("\n"));
        } catch (e: any) {
            console.log(e.message);
        }
    }
}
