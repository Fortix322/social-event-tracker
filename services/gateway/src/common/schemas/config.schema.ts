import { z } from "zod"

export const envSchema = z.object({
    PORT: z.coerce.number(),
    NATS_SERVER: z.string().url(),
    NATS_STREAM_NAME_EVENT: z.string(),
    NATS_SUBJECT_NAME_EVENT: z.string(),
    BODY_SIZE_LIMIT: z.string(),
    LOGS_PATH: z.string(),
    SERVICE_NAME: z.string()
});

export type EnvVars = z.infer<typeof envSchema>;