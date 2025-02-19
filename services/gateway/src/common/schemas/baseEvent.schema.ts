import { z } from "zod";

export const baseEventSchema = z.object({
  eventId: z.string().min(1),
  timestamp: z.string().min(1),
  source: z.enum(["facebook", "tiktok"]),
  funnelStage: z.enum(["top", "bottom"]),
});

export type BaseEvent = z.infer<typeof baseEventSchema>;