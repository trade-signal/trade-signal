/*
  Warnings:

  - The `tags` column on the `news` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `sourceUrl` on table `news` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `stocks` on the `news` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "news" ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "summary" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "source" SET DATA TYPE TEXT,
ALTER COLUMN "sourceId" SET DATA TYPE TEXT,
ALTER COLUMN "sourceUrl" SET NOT NULL,
ALTER COLUMN "sourceUrl" SET DATA TYPE TEXT,
ALTER COLUMN "content" SET DEFAULT '',
ALTER COLUMN "date" DROP DEFAULT,
DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[],
DROP COLUMN "stocks",
ADD COLUMN     "stocks" JSONB NOT NULL;
