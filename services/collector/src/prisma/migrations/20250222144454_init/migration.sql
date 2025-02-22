/*
  Warnings:

  - The values [non_binary] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `city` on the `FacebookUser` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `FacebookUser` table. All the data in the column will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `location` to the `FacebookUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('male', 'female', 'non-binary');
ALTER TABLE "FacebookUser" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "Gender_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_facebookUserId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_tiktokUserId_fkey";

-- DropForeignKey
ALTER TABLE "FacebookEngagement" DROP CONSTRAINT "FacebookEngagement_eventId_fkey";

-- DropForeignKey
ALTER TABLE "TiktokEngagement" DROP CONSTRAINT "TiktokEngagement_eventId_fkey";

-- AlterTable
ALTER TABLE "FacebookUser" DROP COLUMN "city",
DROP COLUMN "country",
ADD COLUMN     "location" JSONB NOT NULL;

-- DropTable
DROP TABLE "Event";

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

-- AddForeignKey
ALTER TABLE "FacebookEvent" ADD CONSTRAINT "FacebookEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "FacebookUser"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacebookEvent" ADD CONSTRAINT "FacebookEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "FacebookEngagement"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TiktokEvent" ADD CONSTRAINT "TiktokEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TiktokUser"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TiktokEvent" ADD CONSTRAINT "TiktokEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "TiktokEngagement"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
