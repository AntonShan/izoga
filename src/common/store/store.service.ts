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
                resolve(this);
            }
        });
    }

    private async awaitDatastore<Return>(cb: () => Promise<Return> | Return, persist = false) {
        await this.loadingPromise;

        const result = await cb();

        if (persist) {
            await this.persist();
        }

        return result;
    }

    async setDefault(name: string) {
        await this.awaitDatastore(() => {
            if (!this.dataStore.profiles.find((profile) => profile.name === name)) {
                throw new Error(`No profile with name "${name}" exist`);
            }
            this.dataStore.default = name;
        }, true);
    }

    async getDefault() {
        return this.awaitDatastore(() => {
            return this.dataStore.default;
        });
    }

    async addProfile(name: string, path: string): Promise<Profile> {
        return await this.awaitDatastore(() => {
            const existingProfile = this.dataStore.profiles.find(
                (profile) => profile.name === name,
            );
            if (existingProfile) {
                throw new Error(`Profile with name "${name}" already exists`);
            }
            const newProfile = { name, path, addons: [] };
            this.dataStore.profiles.push(newProfile);

            return newProfile;
        }, true);
    }

    async deleteProfile(name: string): Promise<void> {
        return this.awaitDatastore(() => {
            this.dataStore.profiles = this.dataStore.profiles.filter((profile) => {
                return profile.name !== name;
            });
        }, true);
    }

    async getProfile(name: string): Promise<Profile> {
        return this.awaitDatastore(() => {
            const profile = this.dataStore.profiles.find((profile) => profile.name === name);

            if (!profile) {
                throw new Error(`Profile "${name}" doesn't exist`);
            }

            return profile;
        });
    }

    async listProfiles(): Promise<Profile[]> {
        return this.awaitDatastore(() => {
            return this.dataStore.profiles;
        });
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
