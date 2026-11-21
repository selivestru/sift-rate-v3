-- AlterTable
ALTER TABLE "Review" ADD COLUMN "seasonNumber" INTEGER;

-- DropIndex
DROP INDEX "Review_userId_mediaId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_mediaId_seasonNumber_key" ON "Review"("userId", "mediaId", "seasonNumber");
