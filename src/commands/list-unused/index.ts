import { CommandInterface } from "../../types/command.interface";
import { Command, Description, Parameter } from "../../decorators";
import { getUnusedAddons } from "../../common/addons/get-unused-addons";

@Command("unused")
@Description("list unused addons in path")
export class ListUnused implements CommandInterface {
    async execute(@Parameter("path", { type: "string" }) path: string): Promise<void> {
        const addons = await getUnusedAddons(path);
        console.log(addons.map((addon) => addon.name).join("\n"));
    }
}
