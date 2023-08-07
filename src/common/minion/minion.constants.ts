export const minionFileList = () => `https://api.mmoui.com/v3/game/ESO/filelist.json`;
export const minionFileDetails = (id: string) =>
    `https://api.mmoui.com/v3/game/ESO/filedetails/${id}.json`;
export const minionFileDownloadUrl = (id: string, fileName: string) =>
    `https://cdn.esoui.com/downloads/file${id}/${fileName}`;
export const minionFileDownloadUrl2 = (id: string, timestamp: number) =>
    `https://cdn.esoui.com/downloads/getfile.php?id=${id}&d=${timestamp / 1000}&minion`;
// `https://cdn.esoui.com/downloads/file${id}/${fileName}?${Date.now() / 10}`;
