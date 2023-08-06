import { CommandInterface } from "../types/command.interface";
import { Command, Description, Parameter } from "../decorators";
import { injectable } from "inversify";
import { AddonsService } from "../common/addons";

@Command("unused")
@injectable()
@Description("list unused addons in path")
export class ListUnused implements CommandInterface {
    constructor(private readonly addonsService: AddonsService) {}

    async execute(@Parameter("path", { type: "string" }) path: string): Promise<void> {
        const addons = await this.addonsService.getUnusedAddons(path);
        console.log(addons.map((addon) => addon.name).join("\n"));
    }
}
