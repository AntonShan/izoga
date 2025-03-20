import { injectable } from "inversify";

import { StoreService } from "../common/store";
import { Command, Description, Parameter } from "../decorators";
import { CommandInterface } from "../types/command.interface";

@Command("set-default")
@Description("Remembers selected profile as default")
@injectable()
export class SetDefaultCommand implements CommandInterface {
    constructor(private readonly storeService: StoreService) {}

    async execute(@Parameter("name", { type: "string" }) name: string): Promise<void> {
        try {
            await this.storeService.setDefault(name);

            console.table(`Profile "${name}" is set as default`);
        } catch (e: any) {
            console.error(e.message);
        }
    }
}
