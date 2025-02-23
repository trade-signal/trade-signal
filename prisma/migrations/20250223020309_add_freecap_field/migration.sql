/*
  Warnings:

  - Added the required column `freeCap` to the `stock_plate_quotes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stock_plate_quotes" ADD COLUMN     "freeCap" DOUBLE PRECISION NOT NULL;
