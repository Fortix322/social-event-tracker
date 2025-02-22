/*
  Warnings:

  - You are about to drop the column `data` on the `Event` table. All the data in the column will be lost.

*/
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

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "data",
ADD COLUMN     "facebookUserId" TEXT,
ADD COLUMN     "tiktokUserId" TEXT;

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
ALTER TABLE "Event" ADD CONSTRAINT "Event_facebookUserId_fkey" FOREIGN KEY ("facebookUserId") REFERENCES "FacebookUser"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_tiktokUserId_fkey" FOREIGN KEY ("tiktokUserId") REFERENCES "TiktokUser"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacebookEngagement" ADD CONSTRAINT "FacebookEngagement_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TiktokEngagement" ADD CONSTRAINT "TiktokEngagement_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
