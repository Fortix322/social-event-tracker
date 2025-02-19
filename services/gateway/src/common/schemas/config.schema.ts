import { z } from "zod"

export const envSchema = z.object({
    PORT: z.coerce.number(),
    NATS_SERVER: z.string().url(),
    NATS_STREAM_NAME_EVENT: z.string(),
    NATS_SUBJECT_NAME_EVENT: z.string()
});

export type EnvVars = z.infer<typeof envSchema>;