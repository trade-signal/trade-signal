-- CreateTable
CREATE TABLE "stock_quotes_latest" (
    "id" TEXT NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "newPrice" DOUBLE PRECISION NOT NULL,
    "changeRate" DOUBLE PRECISION NOT NULL,
    "upsDowns" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "dealAmount" DOUBLE PRECISION NOT NULL,
    "amplitude" DOUBLE PRECISION NOT NULL,
    "turnoverRate" DOUBLE PRECISION NOT NULL,
    "volumeRatio" DOUBLE PRECISION NOT NULL,
    "openPrice" DOUBLE PRECISION NOT NULL,
    "highPrice" DOUBLE PRECISION NOT NULL,
    "lowPrice" DOUBLE PRECISION NOT NULL,
    "preClosePrice" DOUBLE PRECISION NOT NULL,
    "speedIncrease" DOUBLE PRECISION NOT NULL,
    "speedIncrease5" DOUBLE PRECISION NOT NULL,
    "speedIncrease60" DOUBLE PRECISION NOT NULL,
    "speedIncreaseAll" DOUBLE PRECISION NOT NULL,
    "dtsyl" DOUBLE PRECISION NOT NULL,
    "pe9" DOUBLE PRECISION NOT NULL,
    "pe" DOUBLE PRECISION NOT NULL,
    "pbnewmrq" DOUBLE PRECISION NOT NULL,
    "basicEps" DOUBLE PRECISION NOT NULL,
    "bvps" DOUBLE PRECISION NOT NULL,
    "perCapitalReserve" DOUBLE PRECISION NOT NULL,
    "perUnassignProfit" DOUBLE PRECISION NOT NULL,
    "roeWeight" DOUBLE PRECISION NOT NULL,
    "saleGpr" DOUBLE PRECISION NOT NULL,
    "debtAssetRatio" DOUBLE PRECISION NOT NULL,
    "totalOperateIncome" DOUBLE PRECISION NOT NULL,
    "toiYoyRatio" DOUBLE PRECISION NOT NULL,
    "parentNetprofit" DOUBLE PRECISION NOT NULL,
    "netprofitYoyRatio" DOUBLE PRECISION NOT NULL,
    "totalShares" DOUBLE PRECISION NOT NULL,
    "freeShares" DOUBLE PRECISION NOT NULL,
    "totalMarketCap" DOUBLE PRECISION NOT NULL,
    "freeCap" DOUBLE PRECISION NOT NULL,
    "industry" VARCHAR(50) NOT NULL,
    "listingDate" VARCHAR(10) NOT NULL,
    "reportDate" VARCHAR(10) NOT NULL,
    "lastUpdateTs" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_quotes_latest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "stock_quotes_latest_date_idx" ON "stock_quotes_latest"("date");

-- CreateIndex
CREATE INDEX "stock_quotes_latest_code_idx" ON "stock_quotes_latest"("code");

-- CreateIndex
CREATE INDEX "stock_quotes_latest_industry_idx" ON "stock_quotes_latest"("industry");

-- CreateIndex
CREATE INDEX "stock_quotes_latest_code_date_idx" ON "stock_quotes_latest"("code", "date");

-- CreateIndex
CREATE INDEX "stock_quotes_latest_lastUpdateTs_idx" ON "stock_quotes_latest"("lastUpdateTs");

-- CreateIndex
CREATE UNIQUE INDEX "stock_quotes_latest_date_code_key" ON "stock_quotes_latest"("date", "code");
