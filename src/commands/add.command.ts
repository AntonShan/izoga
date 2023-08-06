import { Command, Parameter } from "../decorators";
import { CommandInterface } from "../types/command.interface";
import { injectable } from "inversify";
import { StoreService } from "../common/store";

@Command("add")
@injectable()
export class AddCommand implements CommandInterface {
    constructor(private readonly storeService: StoreService) {}

    async execute(
        @Parameter("path", { type: "string" }) path: string,
        @Parameter("name", { type: "string" }) name: string,
    ): Promise<void> {
        try {
            const newEntry = await this.storeService.addProfile(name, path);

            console.table(newEntry);
        } catch (e: any) {
            console.log(e.message);
        }
    }
}
