import { resolve } from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { type Datastore, datastoreSchema } from "./schema";

let db: Datastore;

function resolvePathToDBFile(): string {
    if (!process.env["LOCALAPPDATA"]) {
        throw new Error("LOCALAPPDATA environment variable is not available");
    }

    return resolve(process.env["LOCALAPPDATA"], "izoga", "persistance.db");
}

export default async function datastore() {
    if (db) return db;

    try {
        const path = resolvePathToDBFile();
        const file = await readFile(path);
        const result = await datastoreSchema.safeParseAsync(file);
        if (!result.success) {
            console.error(result.error);
            db = {
                profiles: [],
            };
        } else {
            db = result.data;
        }
    } catch (e) {
        console.error((e as Error).message);
        process.exit(1);
    }

    return datastore();
}

export async function persist() {
    try {
        const path = resolvePathToDBFile();
        await writeFile(path, JSON.stringify(db));
    } catch (e) {
        console.error((e as Error).message);
    }
}
