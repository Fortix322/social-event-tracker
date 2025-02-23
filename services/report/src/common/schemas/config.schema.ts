import { z } from "zod"

export const envSchema = z.object({
    PORT: z.coerce.number(),
    LOGS_PATH: z.string(),
    SERVICE_NAME: z.string(),
    DATABASE_URL: z.string().url()
});

export type EnvVars = z.infer<typeof envSchema>;