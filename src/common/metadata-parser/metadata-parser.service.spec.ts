import { MetadataParserService } from "./metadata-parser.service";
import { type AddonMetadata, VersionSelector } from "./metadata-parser.types";

const addonManifest = `
## Title: AutoCategory
## APIVersion: 101033 101032
## Author: Shadowfen, crafty35a, RockingDice, Friday_the13_rus
## Description: Inventory categorization. Type "/ac" for settings
## Version: 2.37
## AddOnVersion: 64
## SavedVariables: AutoCategorySavedVars
## DependsOn: LibAddonMenu-2.0>=32 LibSFUtils>=38 LibMediaProvider-1.0 LibDebugLogger
## OptionalDependsOn: GearChangerByIakoni FCOItemSaver QuickMenu ItemSaver ItemMarker UnknownTracker MasterMerchant TamrielTradeCentre SetTrack CharacterKnowledge

lang/strings.lua
lang/$(language).lua

AutoCategory_Global.lua
AutoCategory_Defaults.lua
Plugin_API.lua
AutoCategory.xml
Hooks_Keyboard.lua
Hooks_Gamepad.lua
AutoCategory.lua
AddonMenu.lua
AutoCategory_RuleFunc.lua
AutoCategory_API.lua
Misc_Plugins.lua

; new style addon plugin files
ItemMarker_Plugin.lua
ItemSaver_Plugin.lua
FCOIS_Plugin.lua
Iakoni_GearChanger_Plugin.lua
UnknownTracker_Plugin.lua

; old integration with other addons files
AutoCategory_Integrations_QuickMenu.lua

Bindings.xml

`;

const writWorthyManifest = `
## Title: WritWorthy 7.3.7
## Version: 7.3.7
## AddOnVersion: 070307
## Last Updated: 2023-04-16
## APIVersion: 101037 101038
## Description: Master Writs: calculate material costs and automate crafting.
## Author: ziggr
## Contributors: Dolgubon Friday-The13-rus
## SavedVariables: WritWorthyVars
## DependsOn: LibAddonMenu-2.0>=34 LibPrice>=70410 LibLazyCrafting>=3000 LibSets>=000508 LibCharacterKnowledge>=18
## OptionalDependsOn: LibCustomMenu>=713 AwesomeGuildStore LibSlashCommander LibDebugLogger HomeStationMarker

# Gamepad UI tooltip hook added by Friday-The13-rus

# DE translation by Baertram 2019-04-30
# RU translation by ivann339 2019-09-06 2020-10-16
# FR translation by JAKEZ31  2020-08-27 2021-01-05

            # LibAddonMenu-2.0>=34  required
            #   by Seerah, sirinsidiator
            #       https://www.esoui.com/downloads/info7-LibAddonMenu.html
            #       https://github.com/sirinsidiator/ESO-LibAddonMenu
            #   The "Settings/Addons" UI library that everybody uses.

            # LibPrice  required
            #   by ziggr
            #       https://www.esoui.com/downloads/info2204-LibPrice.html
            #       https://github.com/ziggr/ESO-LibPrice
            #   Provides material price lookups from
            #     - Master Merchant
            #     - Arkadius' Trade Tools
            #     - Tamriel Trade Centre.

            # LibLazyCrafting  required
            #   by Dolgubon
            #       https://www.esoui.com/downloads/info1594-LibLazyCrafting.html
            #       https://github.com/Dolgubon/LibLazyCrafting
            #   How WritWorthy queues and crafts items.

            # LibSets required
            #   by Baertram
            #       https://www.esoui.com/downloads/info2241-LibSets.html
            #       https://github.com/Baertram/LibSets
            #   Set names such as "Alessia's Bullwark" and their required trait counts.

            # LibCharacterKnowledge required
            #   by code65536
            #       https://www.esoui.com/downloads/info3317-LibCharacterKnowledge.html
            #  Motif knowledge: do you know Ashlander Bows?

            # LibSlashCommander optional
            #   by sirinsidiator
            #       https://www.esoui.com/downloads/info1508-LibSlashCommander.html
            #   Provides autocompletion and help text for /writworthy
            #   subcommands like "count".

            # AwesomeGuildStore
            #   by sirinsidiator
            #       https://www.esoui.com/downloads/info695-AwesomeGuildStore.html
            #   OptionalDependsOn so that WritWorthy can detect that AwesomeGuildStore
            #   is present, and add its "crafted price per voucher" filter.

            # LibDebugLogger
            # by Sirinsidiator
            # Allows error/warn/info/debug logging to saved variables.
            # https://www.esoui.com/downloads/info2275-LibDebugLogger.html
            # Can be omitted. Only useful for Zig while developing.

            # Optional libraries used only for unreleased WritWorthy_AutoQuest.lua.
            # Optional as long as I refuse to publish the autoquest feature.
            #
            # LibCustomMenu>=713     optional
            #   by votan
            #       https://www.esoui.com/downloads/info1146-LibCustomMenu>=713.html
            #   Allows "Accept Writ Quests" button in inventory window
            #
            # LibCraftText      optional
            #   by ziggr
            #       https://www.esoui.com/downloads/info2184-LibCraftText.html
            #       https://github.com/ziggr/ESO-LibCraftText
            #   Allows Accept/Rolis dialog automation in languages other than EN English.

WritWorthy_Define.lua

lang/en.lua
lang/$(language).lua
lang/en_forced.lua

WritWorthy_Price.lua
WritWorthy_Util.lua
WritWorthy_Log.lua
WritWorthy_Know.lua
WritWorthy_RequiredSkill.lua
WritWorthy_Smithing.lua
WritWorthy_Alchemy.lua
WritWorthy_Enchanting.lua
WritWorthy_Provisioning.lua
WritWorthy_Link.lua
WritWorthy_MatRow.lua
WritWorthy_Window.lua
WritWorthy_AGS.lua
WritWorthy_I18N.lua
WritWorthy_Profiler.lua
# WritWorthy_AutoQuest.lua
WritWorthy_MatListWindow.lua
WritWorthy.lua
WritWorthy.xml
Bindings.xml
`;

const libMediaProviderManifest = `
## Title: LibMediaProvider-1.0
## Author: Seerah, psypanda, ArtOfShred, Calamath
## Version: 1.0 r26
## APIVersion: 101038 101039
## AddOnVersion: 26
## IsLibrary: true
## Description: Facilitates shared media between addons.  Inspired by and borrowed from LibSharedMedia World of Warcraft.

# This Add-on is not created by, affiliated with or sponsored by ZeniMax Media Inc. or its affiliates.
# The Elder Scrolls® and related logos are registered trademarks or trademarks of ZeniMax Media Inc. in the United States and/or other countries.
# All rights reserved.
#
# You can read the full terms at https://account.elderscrollsonline.com/add-on-terms

fontstrings_shared.xml
backupfont_$(language).xml
LibMediaProvider-1.0.lua
`;

describe("MetadataParserService", () => {
    let service: MetadataParserService;

    beforeEach(async () => {
        service = new MetadataParserService();
    });

    it("Should parse addon metadata", () => {
        /* eslint-disable */
        const expectation: AddonMetadata = {
            name: "AutoCategory",
            title: "AutoCategory",
            apiVersion: ["101033", "101032"],
            version: "2.37",
            savedVariables: ["AutoCategorySavedVars"],
            author: ["Shadowfen", "crafty35a", "RockingDice", "Friday_the13_rus"],
            description: 'Inventory categorization. Type "/ac" for settings',
            dependsOn: [
                {
                    name: "LibAddonMenu-2.0",
                    versionSelector: VersionSelector.greaterThan,
                    version: "32",
                },
                {
                    name: "LibSFUtils",
                    versionSelector: VersionSelector.greaterThan,
                    version: "38",
                },
                { name: "LibMediaProvider-1.0" },
                { name: "LibDebugLogger" },
            ],
            optionalDependsOn: [
                { name: "GearChangerByIakoni" },
                { name: "FCOItemSaver" },
                { name: "QuickMenu" },
                { name: "ItemSaver" },
                { name: "ItemMarker" },
                { name: "UnknownTracker" },
                { name: "MasterMerchant" },
                { name: "TamrielTradeCentre" },
                { name: "SetTrack" },
                { name: "CharacterKnowledge" },
            ],
            isLibrary: false,
            additionalMeta: {
                AddOnVersion: "64",
            },
            sourceFiles: [
                "lang/strings.lua",
                "lang/$(language).lua",
                "AutoCategory_Global.lua",
                "AutoCategory_Defaults.lua",
                "Plugin_API.lua",
                "AutoCategory.xml",
                "Hooks_Keyboard.lua",
                "Hooks_Gamepad.lua",
                "AutoCategory.lua",
                "AddonMenu.lua",
                "AutoCategory_RuleFunc.lua",
                "AutoCategory_API.lua",
                "Misc_Plugins.lua",
                "ItemMarker_Plugin.lua",
                "ItemSaver_Plugin.lua",
                "FCOIS_Plugin.lua",
                "Iakoni_GearChanger_Plugin.lua",
                "UnknownTracker_Plugin.lua",
                "AutoCategory_Integrations_QuickMenu.lua",
                "Bindings.xml",
            ],
        };
        /* eslint-enable */
        expect(service.parse("AutoCategory", addonManifest)).toStrictEqual(expectation);
    });

    it("Should parse WritWorthy manifest", () => {
        const expectation: AddonMetadata = {
            name: "WritWorthy",
            title: "WritWorthy 7.3.7",
            version: "7.3.7",
            apiVersion: ["101037", "101038"],
            author: ["ziggr"],
            description: "Master Writs: calculate material costs and automate crafting.",
            additionalMeta: {
                AddOnVersion: "070307",
                "Last Updated": "2023-04-16",
                Contributors: "Dolgubon Friday-The13-rus",
            },
            savedVariables: ["WritWorthyVars"],
            dependsOn: [
                {
                    name: "LibAddonMenu-2.0",
                    versionSelector: VersionSelector.greaterThan,
                    version: "34",
                },
                {
                    name: "LibPrice",
                    versionSelector: VersionSelector.greaterThan,
                    version: "70410",
                },
                {
                    name: "LibLazyCrafting",
                    versionSelector: VersionSelector.greaterThan,
                    version: "3000",
                },
                {
                    name: "LibSets",
                    versionSelector: VersionSelector.greaterThan,
                    version: "000508",
                },
                {
                    name: "LibCharacterKnowledge",
                    versionSelector: VersionSelector.greaterThan,
                    version: "18",
                },
            ],
            optionalDependsOn: [
                {
                    name: "LibCustomMenu",
                    version: "713",
                    versionSelector: VersionSelector.greaterThan,
                },
                { name: "AwesomeGuildStore" },
                { name: "LibSlashCommander" },
                { name: "LibDebugLogger" },
                { name: "HomeStationMarker" },
            ],
            isLibrary: false,
            sourceFiles: [
                "WritWorthy_Define.lua",
                "lang/en.lua",
                "lang/$(language).lua",
                "lang/en_forced.lua",
                "WritWorthy_Price.lua",
                "WritWorthy_Util.lua",
                "WritWorthy_Log.lua",
                "WritWorthy_Know.lua",
                "WritWorthy_RequiredSkill.lua",
                "WritWorthy_Smithing.lua",
                "WritWorthy_Alchemy.lua",
                "WritWorthy_Enchanting.lua",
                "WritWorthy_Provisioning.lua",
                "WritWorthy_Link.lua",
                "WritWorthy_MatRow.lua",
                "WritWorthy_Window.lua",
                "WritWorthy_AGS.lua",
                "WritWorthy_I18N.lua",
                "WritWorthy_Profiler.lua",
                "WritWorthy_MatListWindow.lua",
                "WritWorthy.lua",
                "WritWorthy.xml",
                "Bindings.xml",
            ],
        };

        expect(service.parse("WritWorthy", writWorthyManifest)).toStrictEqual(expectation);
    });

    it("Should parse LibMediaProvider manifest", () => {
        const expectation: AddonMetadata = {
            name: "LibMediaProvider",
            title: "LibMediaProvider-1.0",
            author: ["Seerah", "psypanda", "ArtOfShred", "Calamath"],
            version: "1.0 r26",
            apiVersion: ["101038", "101039"],
            additionalMeta: {
                AddOnVersion: "26",
            },
            isLibrary: true,
            description:
                "Facilitates shared media between addons.  Inspired by and borrowed from LibSharedMedia World of Warcraft.",
            sourceFiles: [
                "fontstrings_shared.xml",
                "backupfont_$(language).xml",
                "LibMediaProvider-1.0.lua",
            ],
            savedVariables: [],
            optionalDependsOn: [],
            dependsOn: [],
        };

        expect(service.parse("LibMediaProvider", libMediaProviderManifest)).toStrictEqual(
            expectation,
        );
    });
});
