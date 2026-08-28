-- CreateEnum
CREATE TYPE "MediaLanguage" AS ENUM ('EN', 'UK', 'RU');

-- CreateIndex
CREATE UNIQUE INDEX "Media_id_mediaType_key" ON "Media"("id", "mediaType");

-- CreateTable
CREATE TABLE "MediaTranslation" (
    "mediaId" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "language" "MediaLanguage" NOT NULL,
    "title" TEXT,
    "posterUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaTranslation_pkey" PRIMARY KEY ("mediaId", "language")
);

-- AddForeignKey
ALTER TABLE "MediaTranslation"
ADD CONSTRAINT "MediaTranslation_mediaId_mediaType_fkey"
FOREIGN KEY ("mediaId", "mediaType") REFERENCES "Media"("id", "mediaType")
ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddCheck
ALTER TABLE "MediaTranslation"
ADD CONSTRAINT "MediaTranslation_supported_media_type"
CHECK ("mediaType" IN ('MOVIE', 'TV_SHOW'));
