import { Command, Description, Parameter } from "../decorators";
import { CommandInterface } from "../types/command.interface";
import { injectable } from "inversify";
import { AddonsService } from "../common/addons";

@Command("missing")
@injectable()
@Description("List missing addon dependencies")
export class ListMissing implements CommandInterface {
    constructor(private readonly addonsService: AddonsService) {}

    async execute(
        @Parameter("path", { type: "string" }) path: string,
        @Parameter("optional", { type: "boolean", optional: true }) optional: boolean,
    ): Promise<void> {
        const missingAddons = await this.addonsService.getMissingAddons(path, optional);
        if (missingAddons.length === 0) {
            console.log("No missing dependencies found");
        } else {
            console.log("Following dependencies are missing:");
            console.log(missingAddons.map((addon) => addon.name).join("\n"));
        }
    }
}
