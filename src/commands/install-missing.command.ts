import { Command, Description, Parameter } from "../decorators";
import { CommandInterface } from "../types/command.interface";
import { AddonsService } from "../common/addons";
import { StoreService } from "../common/store";
import { MinionService } from "../common/minion";
import { Profile } from "../common/store/store.types";

@Command("install-missing")
@Description("Installs missing addon dependencies")
export class InstallMissingCommand implements CommandInterface {
    constructor(
        private readonly addonsService: AddonsService,
        private readonly storeService: StoreService,
        private readonly minionService: MinionService,
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
        const profile = await this.storeService.getProfile(name);

        for (;;) {
            const installed = await this.doInstall(profile, optional);

            if (installed === 0) break;
        }

        /*
        Как это должно работать:
        - Найти список недостающих аддонов (AddonId - например, LibAddonMenu-2.0)
        - Сходить в API Minion и получить список файлов
        - Найти в списке файлов запись, у которой в поле UIDir есть искомый AddonId
          - Вариант А:
            - У найденной записи взять UID
            - Получить детальную информацию о файле
            - Сделать запрос по адресу `https://cdn.esoui.com/downloads/file${UID}/${UIFileName}?168595784815`.
            query-параметр не понятен, но выглядит как (new Date()) / 10 - const
          - Вариант Б:
            - У найденной записи взять UIFileInfoURL и запросить страницу
            - В запрошенной странице найти iframe, начинающийся на `https://cdn.esoui.com/downloads`
            - Скачать
        */
    }

    private async doInstall(profile: Profile, includeOptional: boolean): Promise<number> {
        const missingAddons = new Set(
            await this.addonsService.getMissingAddons(profile.path, includeOptional),
        );

        if (missingAddons.size === 0) {
            console.log("No missing addons found");
            return 0;
        }

        const minionAddons = await this.minionService.listAddons();
        const addonsToInstall = minionAddons.filter((minionAddon) =>
            minionAddon.ids.some((id) => missingAddons.has(id)),
        );

        console.log("Following addons will be installed:");
        console.log(addonsToInstall.map((addon) => addon.name).join("\n"));

        let installed = 0;
        for await (const addonToInstall of addonsToInstall) {
            await this.minionService.download(addonToInstall, profile.path);
            ++installed;
        }

        return installed;
    }
}
