import { z } from "zod";

export const datastoreSchema = z.object({
    default: z.string().optional(),
    profiles: z.array(
        z.object({
            name: z.string().min(1).max(255),
            path: z.string(),
            addons: z.array(
                z.object({
                    name: z.string(),
                    dependencies: z.array(z.string()),
                }),
            ),
        }),
    ),
    lastUpdate: z.date().optional(),
});

export type Datastore = z.infer<typeof datastoreSchema>;
export type Profile = Datastore["profiles"][number];
