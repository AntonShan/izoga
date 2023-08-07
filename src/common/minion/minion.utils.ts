import { AddonDetails, AddonSummary, MinionFileDetails, MinionFileShort } from "./minion.types";

export function toAddonSummary(data: MinionFileShort): AddonSummary {
    return {
        id: data.UID,
        fileInfoUrl: data.UIFileInfoURL,
        name: data.UIName,
        ids: data.UIDir,
    };
}

export function toAddonDetails(data: MinionFileDetails): AddonDetails {
    return {
        id: data.UID,
        fileName: data.UIFileName,
        date: data.UIDate,
    };
}
