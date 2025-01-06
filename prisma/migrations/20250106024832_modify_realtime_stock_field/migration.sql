/*
  Warnings:

  - A unique constraint covering the columns `[ts,code]` on the table `stock_index_real_time` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ts,code]` on the table `stock_real_time` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ts` to the `stock_index_real_time` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ts` to the `stock_real_time` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "stock_index_real_time_date_code_key";

-- DropIndex
DROP INDEX "stock_real_time_code_date_industry_idx";

-- AlterTable
ALTER TABLE "stock_index_real_time" ADD COLUMN     "ts" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "stock_real_time" ADD COLUMN     "ts" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "stock_index_real_time_ts_idx" ON "stock_index_real_time"("ts");

-- CreateIndex
CREATE UNIQUE INDEX "stock_index_real_time_ts_code_key" ON "stock_index_real_time"("ts", "code");

-- CreateIndex
CREATE INDEX "stock_real_time_ts_idx" ON "stock_real_time"("ts");

-- CreateIndex
CREATE UNIQUE INDEX "stock_real_time_ts_code_key" ON "stock_real_time"("ts", "code");
