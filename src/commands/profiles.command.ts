import { Command } from "../decorators";
import { CommandInterface } from "../types/command.interface";
import { injectable } from "inversify";
import { StoreService } from "../common/store";

@Command("profiles")
@injectable()
export class ProfilesCommand implements CommandInterface {
    constructor(private readonly storeService: StoreService) {}

    async execute(): Promise<void> {
        const profiles = await this.storeService.listProfiles();

        if (profiles.length === 0) {
            console.log("No registered profiles found");
            return;
        }

        console.table(profiles);
    }
}
