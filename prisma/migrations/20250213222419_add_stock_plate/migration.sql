-- CreateTable
CREATE TABLE "stock_plate_basic" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "marketId" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_plate_basic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_plate_quotes" (
    "id" TEXT NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "newPrice" DOUBLE PRECISION NOT NULL,
    "changeRate" DOUBLE PRECISION NOT NULL,
    "upsDowns" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "dealAmount" DOUBLE PRECISION NOT NULL,
    "turnoverRate" DOUBLE PRECISION NOT NULL,
    "totalMarketCap" DOUBLE PRECISION NOT NULL,
    "upCount" INTEGER NOT NULL,
    "downCount" INTEGER NOT NULL,
    "topGainerName" TEXT NOT NULL,
    "topGainerCode" TEXT NOT NULL,
    "topLoserName" TEXT NOT NULL,
    "topLoserCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_plate_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stock_plate_basic_code_key" ON "stock_plate_basic"("code");

-- CreateIndex
CREATE INDEX "stock_plate_basic_code_idx" ON "stock_plate_basic"("code");

-- CreateIndex
CREATE INDEX "stock_plate_quotes_date_idx" ON "stock_plate_quotes"("date");

-- CreateIndex
CREATE INDEX "stock_plate_quotes_code_idx" ON "stock_plate_quotes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "stock_plate_quotes_date_code_key" ON "stock_plate_quotes"("date", "code");
