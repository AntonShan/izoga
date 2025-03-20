export type MinionFileShortResponse = MinionFileShort[];

export interface MinionFileShort {
    UID: string;
    UICATID: string;
    UIVersion: string;
    UIDate: number;
    UIName: string;
    UIAuthorName: string;
    UIFileInfoURL: string;
    UIDownloadTotal: string;
    UIDownloadMonthly: string;
    UIFavoriteTotal: string;
    UICompatibility: { version: string; name: string }[];
    UIDir: string[];
    UIIMG_Thumbs: string[];
    UIIMGs: string[];
    UISiblings: null;
    UIDonationLink: string | null;
}

export type MinionFileDetailsResponse = MinionFileDetails[];

export interface MinionFileDetails {
    UID: string;
    UICATID: string;
    UIVersion: string;
    UIDate: number;
    UIMD5: string;
    UIFileName: string;
    UIDownload: string;
    UIPending: string;
    UIName: string;
    UIAuthorName: string;
    UIDescription: string;
    UIChangeLog: string;
    UIHitCount: string;
    UIHitCountMonthly: string;
    UIFavoriteTotal: string;
}

export interface AddonSummary {
    id: string;
    fileInfoUrl: string;
    name: string;
    // AddonId's of addons included in minion addon
    ids: string[];
    version: string;
}

export interface AddonSummary2 {
    id: string;
    fileInfoUrl: string;
    name: string;
    version: string;
}

export interface AddonDetails {
    id: string;
    fileName: string;
    date: number;
}
