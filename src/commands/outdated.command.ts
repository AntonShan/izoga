import { injectable } from "inversify";

import { AddonsService } from "../common/addons";
import { MinionService } from "../common/minion";
import { StoreService } from "../common/store";
import { Command, Description, Parameter } from "../decorators";
import type { CommandInterface } from "../types/command.interface";

@Command("outdated")
@Description("Lists outdated addons")
@injectable()
export class OutdatedCommand implements CommandInterface {
    constructor(
        private readonly addonsService: AddonsService,
        private readonly storeService: StoreService,
        private readonly minionService: MinionService,
    ) {}

    async execute(
        @Parameter("name", { description: "Profile name to use", type: "string" }) name: string,
    ): Promise<void> {
        const profile = await this.storeService.getProfile(name);
        const [installedAddons, addonsList] = await Promise.all([
            this.addonsService.getInstalledAddons(profile.path),
            this.minionService.listAddons2(),
        ]);
        const addonVersions = Object.fromEntries(
            addonsList.map((addon) => [addon.id, addon.version]),
        );

        const outdatedAddons = installedAddons.filter(
            (addon) => addon.version !== addonVersions[addon.name],
        );

        console.log(
            outdatedAddons
                .map(
                    (v) =>
                        `${v.name} - installed ${v.version} - available ${addonVersions[v.name]} `,
                )
                .join("\n"),
        );
    }
}
