import { z } from "zod"

export const envSchema = z.object({
    PORT: z.coerce.number(),
    NATS_SERVER: z.string().url()
});

export type EnvVars = z.infer<typeof envSchema>;