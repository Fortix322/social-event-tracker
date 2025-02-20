-- CreateEnum
CREATE TYPE "FunnelStage" AS ENUM ('top', 'bottom');

-- CreateEnum
CREATE TYPE "FacebookEventType" AS ENUM ('ad_view', 'page_like', 'comment', 'video_view', 'ad_click', 'form_submission', 'checkout_complete');

-- CreateEnum
CREATE TYPE "TiktokEventType" AS ENUM ('video_view', 'like', 'share', 'comment', 'profile_visit', 'purchase', 'follow');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'non_binary');

-- CreateEnum
CREATE TYPE "Referrer" AS ENUM ('newsfeed', 'marketplace', 'groups');

-- CreateEnum
CREATE TYPE "ClickPosition" AS ENUM ('top_left', 'bottom_right', 'center');

-- CreateEnum
CREATE TYPE "FacebookDevice" AS ENUM ('mobile', 'desktop');

-- CreateEnum
CREATE TYPE "Browser" AS ENUM ('Chrome', 'Firefox', 'Safari');

-- CreateEnum
CREATE TYPE "TiktokDevice" AS ENUM ('Android', 'iOS', 'Desktop');

-- CreateTable
CREATE TABLE "FacebookUser" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "FacebookUser_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "FacebookEvent" (
    "eventId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "funnelStage" "FunnelStage" NOT NULL,
    "eventType" "FacebookEventType" NOT NULL,
    "actionTime" TIMESTAMP(3),
    "referrer" "Referrer",
    "videoId" TEXT,
    "adId" TEXT,
    "campaignId" TEXT,
    "clickPosition" "ClickPosition",
    "device" "FacebookDevice",
    "browser" "Browser",
    "purchaseAmount" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FacebookEvent_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "TiktokUser" (
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,

    CONSTRAINT "TiktokUser_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "TiktokEvent" (
    "eventId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "funnelStage" "FunnelStage" NOT NULL,
    "eventType" "TiktokEventType" NOT NULL,
    "watchTime" DOUBLE PRECISION,
    "percentageWatched" DOUBLE PRECISION,
    "tiktokDevice" "TiktokDevice",
    "country" TEXT,
    "videoId" TEXT,
    "actionTime" TIMESTAMP(3),
    "profileId" TEXT,
    "purchasedItem" TEXT,
    "purchaseAmount" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TiktokEvent_pkey" PRIMARY KEY ("eventId")
);

-- AddForeignKey
ALTER TABLE "FacebookEvent" ADD CONSTRAINT "FacebookEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "FacebookUser"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TiktokEvent" ADD CONSTRAINT "TiktokEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TiktokUser"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
