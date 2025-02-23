-- CreateEnum
CREATE TYPE "Source" AS ENUM ('facebook', 'tiktok');

-- CreateEnum
CREATE TYPE "FunnelStage" AS ENUM ('top', 'bottom');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'non-binary');

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
CREATE TABLE "FacebookEvent" (
    "eventId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "funnelStage" "FunnelStage" NOT NULL,
    "eventType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FacebookEvent_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "TiktokEvent" (
    "eventId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "funnelStage" "FunnelStage" NOT NULL,
    "eventType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TiktokEvent_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "FacebookUser" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "location" JSONB NOT NULL,

    CONSTRAINT "FacebookUser_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "FacebookEngagement" (
    "eventId" TEXT NOT NULL,
    "actionTime" TIMESTAMP(3),
    "referrer" "Referrer",
    "videoId" TEXT,
    "adId" TEXT,
    "campaignId" TEXT,
    "clickPosition" "ClickPosition",
    "device" "FacebookDevice",
    "browser" "Browser",
    "purchaseAmount" DECIMAL(65,30),

    CONSTRAINT "FacebookEngagement_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "TiktokUser" (
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,

    CONSTRAINT "TiktokUser_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "TiktokEngagement" (
    "eventId" TEXT NOT NULL,
    "watchTime" INTEGER,
    "percentageWatched" DOUBLE PRECISION,
    "device" "TiktokDevice",
    "country" TEXT,
    "videoId" TEXT,
    "actionTime" TIMESTAMP(3),
    "profileId" TEXT,
    "purchasedItem" TEXT,
    "purchaseAmount" DECIMAL(65,30),

    CONSTRAINT "TiktokEngagement_pkey" PRIMARY KEY ("eventId")
);

-- AddForeignKey
ALTER TABLE "FacebookEvent" ADD CONSTRAINT "FacebookEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "FacebookUser"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacebookEvent" ADD CONSTRAINT "FacebookEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "FacebookEngagement"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TiktokEvent" ADD CONSTRAINT "TiktokEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TiktokUser"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TiktokEvent" ADD CONSTRAINT "TiktokEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "TiktokEngagement"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
