/*
  Warnings:

  - You are about to drop the column `imdbId` on the `Media` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Media_imdbId_key";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "imdbId";
