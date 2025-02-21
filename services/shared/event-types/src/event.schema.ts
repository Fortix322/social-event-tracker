import { z } from "zod";

export const funnelStageSchema = z.enum(["top", "bottom"]);
export type FunnelStage = z.infer<typeof funnelStageSchema>;

export const facebookTopEventTypeSchema = z.enum(["ad.view", "page.like", "comment", "video.view"]);
export type FacebookTopEventType = z.infer<typeof facebookTopEventTypeSchema>;

export const facebookBottomEventTypeSchema = z.enum(["ad.click", "form.submission", "checkout.complete"]);
export type FacebookBottomEventType = z.infer<typeof facebookBottomEventTypeSchema>;

export const facebookEventTypeSchema = z.union([facebookTopEventTypeSchema, facebookBottomEventTypeSchema]);
export type FacebookEventType = z.infer<typeof facebookEventTypeSchema>;

export const facebookUserLocationSchema = z.object({
  country: z.string(),
  city: z.string(),
});
export type FacebookUserLocation = z.infer<typeof facebookUserLocationSchema>;

export const facebookUserSchema = z.object({
  userId: z.string(),
  name: z.string(),
  age: z.number(),
  gender: z.enum(["male", "female", "non-binary"]),
  location: facebookUserLocationSchema,
});
export type FacebookUser = z.infer<typeof facebookUserSchema>;

export const facebookEngagementTopSchema = z.object({
  actionTime: z.string(),
  referrer: z.enum(["newsfeed", "marketplace", "groups"]),
  videoId: z.string().nullable(),
});
export type FacebookEngagementTop = z.infer<typeof facebookEngagementTopSchema>;

export const facebookEngagementBottomSchema = z.object({
  adId: z.string(),
  campaignId: z.string(),
  clickPosition: z.enum(["top_left", "bottom_right", "center"]),
  device: z.enum(["mobile", "desktop"]),
  browser: z.enum(["Chrome", "Firefox", "Safari"]),
  purchaseAmount: z.string().nullable(),
});
export type FacebookEngagementBottom = z.infer<typeof facebookEngagementBottomSchema>;

export const facebookEngagementSchema = z.union([facebookEngagementTopSchema, facebookEngagementBottomSchema]);
export type FacebookEngagement = z.infer<typeof facebookEngagementSchema>;

export const facebookEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal("facebook"),
  funnelStage: funnelStageSchema,
  eventType: facebookEventTypeSchema,
  data: z.object({
    user: facebookUserSchema,
    engagement: facebookEngagementSchema,
  }),
});
export type FacebookEvent = z.infer<typeof facebookEventSchema>;

export const tiktokTopEventTypeSchema = z.enum(["video.view", "like", "share", "comment"]);
export type TiktokTopEventType = z.infer<typeof tiktokTopEventTypeSchema>;

export const tiktokBottomEventTypeSchema = z.enum(["profile.visit", "purchase", "follow"]);
export type TiktokBottomEventType = z.infer<typeof tiktokBottomEventTypeSchema>;

export const tiktokEventTypeSchema = z.union([tiktokTopEventTypeSchema, tiktokBottomEventTypeSchema]);
export type TiktokEventType = z.infer<typeof tiktokEventTypeSchema>;

export const tiktokUserSchema = z.object({
  userId: z.string(),
  username: z.string(),
  followers: z.number(),
});
export type TiktokUser = z.infer<typeof tiktokUserSchema>;

export const tiktokEngagementTopSchema = z.object({
  watchTime: z.number(),
  percentageWatched: z.number(),
  device: z.enum(["Android", "iOS", "Desktop"]),
  country: z.string(),
  videoId: z.string(),
});
export type TiktokEngagementTop = z.infer<typeof tiktokEngagementTopSchema>;

export const tiktokEngagementBottomSchema = z.object({
  actionTime: z.string(),
  profileId: z.string().nullable(),
  purchasedItem: z.string().nullable(),
  purchaseAmount: z.string().nullable(),
});
export type TiktokEngagementBottom = z.infer<typeof tiktokEngagementBottomSchema>;

export const tiktokEngagementSchema = z.union([tiktokEngagementTopSchema, tiktokEngagementBottomSchema]);
export type TiktokEngagement = z.infer<typeof tiktokEngagementSchema>;

export const tiktokEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal("tiktok"),
  funnelStage: funnelStageSchema,
  eventType: tiktokEventTypeSchema,
  data: z.object({
    user: tiktokUserSchema,
    engagement: tiktokEngagementSchema,
  }),
});
export type TiktokEvent = z.infer<typeof tiktokEventSchema>;

export const eventSchema = z.union([facebookEventSchema, tiktokEventSchema]);
export type Event = z.infer<typeof eventSchema>;
