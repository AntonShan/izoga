import { Command, Parameter } from "../decorators";
import { CommandInterface } from "../types/command.interface";
import { injectable } from "inversify";
import { StoreService } from "../common/store";

@Command("profile-remove")
@injectable()
export class RemoveProfileCommand implements CommandInterface {
    constructor(private readonly storeService: StoreService) {}

    async execute(@Parameter("name", { type: "string" }) name: string): Promise<void> {
        try {
            await this.storeService.deleteProfile(name);

            console.log(`Successfully removed profile "${name}". Addons folder remains intact`);
        } catch (e: any) {
            console.log(e.message);
        }
    }
}
