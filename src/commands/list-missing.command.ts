import { Command, Description, Parameter } from "../decorators";
import { CommandInterface } from "../types/command.interface";
import { injectable } from "inversify";
import { AddonsService } from "../common/addons";
import { StoreService } from "../common/store";

@Command("missing")
@injectable()
@Description("List missing addon dependencies")
export class ListMissing implements CommandInterface {
    constructor(
        private readonly addonsService: AddonsService,
        private readonly storeService: StoreService,
    ) {}

    async execute(
        @Parameter("name", { description: "Profile name to use", type: "string" }) name: string,
        @Parameter("optional", {
            description: "Include optional dependencies",
            type: "boolean",
            optional: true,
        })
        optional: boolean,
    ): Promise<void> {
        try {
            const profile = await this.storeService.getProfile(name);
            const missingAddons = await this.addonsService.getMissingAddons(profile.path, optional);
            if (missingAddons.length === 0) {
                console.log("No missing dependencies found");
            } else {
                console.log("Following dependencies are missing:");
                console.log(missingAddons.join("\n"));
            }
        } catch (error) {
            debugger;
        }
    }
}
