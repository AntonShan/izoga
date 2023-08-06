import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { injectable } from "inversify";
import { Datastore, datastoreSchema, Profile } from "./store.types";

@injectable()
export class StoreService {
    private dataStore: Datastore;
    public loadingPromise: Promise<StoreService>;

    constructor() {
        this.dataStore = {
            profiles: [],
        };
        this.loadingPromise = this.loadDataStore();
    }

    private resolvePathToDBFile(): string {
        if (!process.env["LOCALAPPDATA"]) {
            throw new Error("LOCALAPPDATA environment variable is not available");
        }

        return resolve(process.env["LOCALAPPDATA"], "izoga", "store.db");
    }

    async loadDataStore() {
        return new Promise<StoreService>(async (resolve, reject) => {
            try {
                const path = this.resolvePathToDBFile();
                const file = await readFile(path, { encoding: "utf-8" });
                const result = await datastoreSchema.safeParseAsync(JSON.parse(file));
                if (!result.success) {
                    console.error(result.error);
                    reject(result.error);
                } else {
                    this.dataStore = result.data;
                    resolve(this);
                }
            } catch (e) {
                this.dataStore = {
                    profiles: [],
                };
            }
        });
    }

    async addProfile(name: string, path: string): Promise<Profile> {
        await this.loadingPromise;
        const existingProfile = this.dataStore.profiles.find((profile) => profile.name === name);
        if (existingProfile) {
            throw new Error(`Profile with name "${name}" already exists`);
        }
        const newProfile = { name, path, addons: [] };
        this.dataStore.profiles.push(newProfile);
        await this.persist();
        return newProfile;
    }

    async deleteProfile(name: string): Promise<void> {
        await this.loadingPromise;
        this.dataStore.profiles = this.dataStore.profiles.filter((profile) => {
            return profile.name === name;
        });
        await this.persist();
    }

    async listProfiles(): Promise<Profile[]> {
        await this.loadingPromise;
        return this.dataStore.profiles;
    }

    private async persist(): Promise<void> {
        try {
            const path = this.resolvePathToDBFile();
            await writeFile(path, JSON.stringify(this.dataStore));
        } catch (e) {
            console.error("Failed to persist datastore");
        }
    }
}
