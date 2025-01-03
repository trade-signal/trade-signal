/*
  Warnings:

  - Added the required column `amplitude` to the `stock_quotes_daily` table without a default value. This is not possible if the table is not empty.
  - Added the required column `changeRate` to the `stock_quotes_daily` table without a default value. This is not possible if the table is not empty.
  - Added the required column `turnoverRate` to the `stock_quotes_daily` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upsDowns` to the `stock_quotes_daily` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volumeRatio` to the `stock_quotes_daily` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stock_quotes_daily" ADD COLUMN     "amplitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "changeRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "turnoverRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "upsDowns" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "volumeRatio" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "stock_index_real_time" (
    "id" TEXT NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "newPrice" DOUBLE PRECISION NOT NULL,
    "openPrice" DOUBLE PRECISION NOT NULL,
    "highPrice" DOUBLE PRECISION NOT NULL,
    "lowPrice" DOUBLE PRECISION NOT NULL,
    "preClosePrice" DOUBLE PRECISION NOT NULL,
    "changeRate" DOUBLE PRECISION NOT NULL,
    "upsDowns" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "dealAmount" DOUBLE PRECISION NOT NULL,
    "amplitude" DOUBLE PRECISION NOT NULL,
    "turnoverRate" DOUBLE PRECISION NOT NULL,
    "volumeRatio" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_index_real_time_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "stock_index_real_time_date_idx" ON "stock_index_real_time"("date");

-- CreateIndex
CREATE INDEX "stock_index_real_time_code_idx" ON "stock_index_real_time"("code");

-- CreateIndex
CREATE UNIQUE INDEX "stock_index_real_time_date_code_key" ON "stock_index_real_time"("date", "code");
