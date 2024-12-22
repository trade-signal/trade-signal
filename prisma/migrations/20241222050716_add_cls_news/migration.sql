/*
  Warnings:

  - You are about to drop the column `createdAt` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `news` table. All the data in the column will be lost.
  - The `tags` column on the `news` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `summary` to the `news` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `news` table without a default value. This is not possible if the table is not empty.
  - Made the column `sourceUrl` on table `news` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `stocks` on the `news` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "news" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "summary" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "source" SET DATA TYPE TEXT,
ALTER COLUMN "sourceId" SET DATA TYPE TEXT,
ALTER COLUMN "sourceUrl" SET NOT NULL,
ALTER COLUMN "sourceUrl" SET DATA TYPE TEXT,
ALTER COLUMN "date" DROP DEFAULT,
DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[],
DROP COLUMN "stocks",
ADD COLUMN     "stocks" JSONB NOT NULL;
