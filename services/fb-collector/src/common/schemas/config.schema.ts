import { z } from "zod"

export const envSchema = z.object({
    PORT: z.coerce.number(),
    NATS_SERVER: z.string().url(),
    NATS_STREAM_NAME_EVENT: z.string(),
    NATS_CONSUMER_NAME_EVENT: z.string(),
    NATS_SUBJECT_NAME_EVENT: z.string(),
    SOURCE_EVENT: z.enum(["facebook", "tiktok"])
});

export type EnvVars = z.infer<typeof envSchema>;