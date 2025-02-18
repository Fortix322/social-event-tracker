import { z } from "zod"

export const envSchema = z.object({
    PORT: z.coerce.number()
});

export type EnvVars = z.infer<typeof envSchema>;