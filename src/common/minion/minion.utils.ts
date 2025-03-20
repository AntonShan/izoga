import type {
    AddonDetails,
    AddonSummary,
    AddonSummary2,
    MinionFileDetails,
    MinionFileShort,
} from "./minion.types";

export function toAddonSummary(data: MinionFileShort): AddonSummary {
    return {
        id: data.UID,
        fileInfoUrl: data.UIFileInfoURL,
        name: data.UIName,
        ids: data.UIDir,
        version: data.UIVersion,
    };
}

export function toAddonSummary2(data: MinionFileShort): AddonSummary2 {
    return {
        id: data.UID,
        fileInfoUrl: data.UIFileInfoURL,
        name: data.UIName,
        version: data.UIVersion,
    };
}

export function toAddonDetails(data: MinionFileDetails): AddonDetails {
    return {
        id: data.UID,
        fileName: data.UIFileName,
        date: data.UIDate,
    };
}
