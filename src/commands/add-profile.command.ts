import { injectable } from "inversify";

import { StoreService } from "../common/store";
import { Command, Parameter } from "../decorators";
import { type CommandInterface } from "../types/command.interface";

@Command("profile-add")
@injectable()
export class AddProfileCommand implements CommandInterface {
    constructor(private readonly storeService: StoreService) {}

    async execute(
        @Parameter("path", { type: "string" }) path: string,
        @Parameter("name", { type: "string" }) name: string,
    ): Promise<void> {
        try {
            const newEntry = await this.storeService.addProfile(name, path);

            console.table(newEntry);
        } catch (e) {
            console.log((e as Error).message);
        }
    }
}
