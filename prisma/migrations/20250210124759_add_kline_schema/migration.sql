/*
  Warnings:

  - You are about to drop the `batch_update` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_index_real_time` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_quotes_daily` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_quotes_latest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_real_time` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_selection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "batch_update";

-- DropTable
DROP TABLE "stock";

-- DropTable
DROP TABLE "stock_index_real_time";

-- DropTable
DROP TABLE "stock_quotes_daily";

-- DropTable
DROP TABLE "stock_quotes_latest";

-- DropTable
DROP TABLE "stock_real_time";

-- DropTable
DROP TABLE "stock_selection";

-- CreateTable
CREATE TABLE "stock_basic" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "industry" VARCHAR(50) NOT NULL,
    "listingDate" VARCHAR(10) NOT NULL,
    "marketId" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_basic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_index_basic" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "marketId" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_index_basic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_screener" (
    "date" VARCHAR(10) NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "secucode" VARCHAR(10) NOT NULL,
    "newPrice" DOUBLE PRECISION NOT NULL,
    "changeRate" DOUBLE PRECISION NOT NULL,
    "volumeRatio" DOUBLE PRECISION NOT NULL,
    "highPrice" DOUBLE PRECISION NOT NULL,
    "lowPrice" DOUBLE PRECISION NOT NULL,
    "preClosePrice" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "dealAmount" DOUBLE PRECISION NOT NULL,
    "turnoverRate" DOUBLE PRECISION NOT NULL,
    "amplitude" DOUBLE PRECISION NOT NULL,
    "listingDate" VARCHAR(10) NOT NULL,
    "industry" VARCHAR(50) NOT NULL,
    "area" VARCHAR(50) NOT NULL,
    "concept" VARCHAR(800) NOT NULL,
    "style" VARCHAR(255) NOT NULL,
    "isHs300" BOOLEAN NOT NULL,
    "isSz50" BOOLEAN NOT NULL,
    "isZz500" BOOLEAN NOT NULL,
    "isZz1000" BOOLEAN NOT NULL,
    "isCy50" BOOLEAN NOT NULL,
    "pe9" DOUBLE PRECISION NOT NULL,
    "pbnewmrq" DOUBLE PRECISION NOT NULL,
    "pettmdeducted" DOUBLE PRECISION NOT NULL,
    "ps9" DOUBLE PRECISION NOT NULL,
    "pcfjyxjl9" DOUBLE PRECISION NOT NULL,
    "predictPeSyear" DOUBLE PRECISION NOT NULL,
    "predictPeNyear" DOUBLE PRECISION NOT NULL,
    "totalMarketCap" DOUBLE PRECISION NOT NULL,
    "freeCap" DOUBLE PRECISION NOT NULL,
    "dtsyl" DOUBLE PRECISION NOT NULL,
    "ycpeg" DOUBLE PRECISION NOT NULL,
    "enterpriseValueMultiple" DOUBLE PRECISION NOT NULL,
    "basicEps" DOUBLE PRECISION NOT NULL,
    "bvps" DOUBLE PRECISION NOT NULL,
    "perNetcashOperate" DOUBLE PRECISION NOT NULL,
    "perFcfe" DOUBLE PRECISION NOT NULL,
    "perCapitalReserve" DOUBLE PRECISION NOT NULL,
    "perUnassignProfit" DOUBLE PRECISION NOT NULL,
    "perSurplusReserve" DOUBLE PRECISION NOT NULL,
    "perRetainedEarning" DOUBLE PRECISION NOT NULL,
    "parentNetprofit" DOUBLE PRECISION NOT NULL,
    "deductNetprofit" DOUBLE PRECISION NOT NULL,
    "totalOperateIncome" DOUBLE PRECISION NOT NULL,
    "roeWeight" DOUBLE PRECISION NOT NULL,
    "jroa" DOUBLE PRECISION NOT NULL,
    "roic" DOUBLE PRECISION NOT NULL,
    "zxgxl" DOUBLE PRECISION NOT NULL,
    "saleGpr" DOUBLE PRECISION NOT NULL,
    "saleNpr" DOUBLE PRECISION NOT NULL,
    "netprofitYoyRatio" DOUBLE PRECISION NOT NULL,
    "deductNetprofitGrowthrate" DOUBLE PRECISION NOT NULL,
    "toiYoyRatio" DOUBLE PRECISION NOT NULL,
    "netprofitGrowthrate3y" DOUBLE PRECISION NOT NULL,
    "incomeGrowthrate3y" DOUBLE PRECISION NOT NULL,
    "predictNetprofitRatio" DOUBLE PRECISION NOT NULL,
    "predictIncomeRatio" DOUBLE PRECISION NOT NULL,
    "basicepsYoyRatio" DOUBLE PRECISION NOT NULL,
    "totalProfitGrowthrate" DOUBLE PRECISION NOT NULL,
    "operateProfitGrowthrate" DOUBLE PRECISION NOT NULL,
    "debtAssetRatio" DOUBLE PRECISION NOT NULL,
    "equityRatio" DOUBLE PRECISION NOT NULL,
    "equityMultiplier" DOUBLE PRECISION NOT NULL,
    "currentRatio" DOUBLE PRECISION NOT NULL,
    "speedRatio" DOUBLE PRECISION NOT NULL,
    "totalShares" DOUBLE PRECISION NOT NULL,
    "freeShares" DOUBLE PRECISION NOT NULL,
    "holderNewest" INTEGER NOT NULL,
    "holderRatio" DOUBLE PRECISION NOT NULL,
    "holdAmount" DOUBLE PRECISION NOT NULL,
    "avgHoldNum" DOUBLE PRECISION NOT NULL,
    "holdnumGrowthrate3q" DOUBLE PRECISION NOT NULL,
    "holdnumGrowthrateHy" DOUBLE PRECISION NOT NULL,
    "holdRatioCount" DOUBLE PRECISION NOT NULL,
    "freeHoldRatio" DOUBLE PRECISION NOT NULL,
    "macdGoldenFork" BOOLEAN NOT NULL,
    "macdGoldenForkz" BOOLEAN NOT NULL,
    "macdGoldenForky" BOOLEAN NOT NULL,
    "kdjGoldenFork" BOOLEAN NOT NULL,
    "kdjGoldenForkz" BOOLEAN NOT NULL,
    "kdjGoldenForky" BOOLEAN NOT NULL,
    "breakThrough" BOOLEAN NOT NULL,
    "lowFundsInflow" BOOLEAN NOT NULL,
    "highFundsOutflow" BOOLEAN NOT NULL,
    "breakupMa5days" BOOLEAN NOT NULL,
    "breakupMa10days" BOOLEAN NOT NULL,
    "breakupMa20days" BOOLEAN NOT NULL,
    "breakupMa30days" BOOLEAN NOT NULL,
    "breakupMa60days" BOOLEAN NOT NULL,
    "longAvgArray" BOOLEAN NOT NULL,
    "shortAvgArray" BOOLEAN NOT NULL,
    "upperLargeVolume" BOOLEAN NOT NULL,
    "downNarrowVolume" BOOLEAN NOT NULL,
    "oneDayangLine" BOOLEAN NOT NULL,
    "twoDayangLines" BOOLEAN NOT NULL,
    "riseSun" BOOLEAN NOT NULL,
    "powerFulgun" BOOLEAN NOT NULL,
    "restoreJustice" BOOLEAN NOT NULL,
    "down7days" BOOLEAN NOT NULL,
    "upper8days" BOOLEAN NOT NULL,
    "upper9days" BOOLEAN NOT NULL,
    "upper4days" BOOLEAN NOT NULL,
    "heavenRule" BOOLEAN NOT NULL,
    "upsideVolume" BOOLEAN NOT NULL,
    "allcorpNum" INTEGER NOT NULL,
    "allcorpFundNum" INTEGER NOT NULL,
    "allcorpQsNum" INTEGER NOT NULL,
    "allcorpQfiiNum" INTEGER NOT NULL,
    "allcorpBxNum" INTEGER NOT NULL,
    "allcorpSbNum" INTEGER NOT NULL,
    "allcorpXtNum" INTEGER NOT NULL,
    "allcorpRatio" DOUBLE PRECISION NOT NULL,
    "allcorpFundRatio" DOUBLE PRECISION NOT NULL,
    "allcorpQsRatio" DOUBLE PRECISION NOT NULL,
    "allcorpQfiiRatio" DOUBLE PRECISION NOT NULL,
    "allcorpBxRatio" DOUBLE PRECISION NOT NULL,
    "allcorpSbRatio" DOUBLE PRECISION NOT NULL,
    "allcorpXtRatio" DOUBLE PRECISION NOT NULL,
    "netInflow" DOUBLE PRECISION NOT NULL,
    "netinflow3days" DOUBLE PRECISION NOT NULL,
    "netinflow5days" DOUBLE PRECISION NOT NULL,
    "nowinterstRatio" DOUBLE PRECISION NOT NULL,
    "nowinterstRatio3d" DOUBLE PRECISION NOT NULL,
    "nowinterstRatio5d" DOUBLE PRECISION NOT NULL,
    "ddx" DOUBLE PRECISION NOT NULL,
    "ddx3d" DOUBLE PRECISION NOT NULL,
    "ddx5d" DOUBLE PRECISION NOT NULL,
    "ddxRed10d" INTEGER NOT NULL,
    "changerate3days" DOUBLE PRECISION NOT NULL,
    "changerate5days" DOUBLE PRECISION NOT NULL,
    "changerate10days" DOUBLE PRECISION NOT NULL,
    "changerateTy" DOUBLE PRECISION NOT NULL,
    "upnday" INTEGER NOT NULL,
    "downnday" INTEGER NOT NULL,
    "mutualNetbuyAmt" DOUBLE PRECISION NOT NULL,
    "holdRatio" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_screener_pkey" PRIMARY KEY ("date","code")
);

-- CreateTable
CREATE TABLE "stock_quotes" (
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_index_quotes" (
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

    CONSTRAINT "stock_index_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_minute_kline" (
    "id" TEXT NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "period" INTEGER NOT NULL DEFAULT 1,
    "openPrice" DOUBLE PRECISION NOT NULL,
    "highPrice" DOUBLE PRECISION NOT NULL,
    "lowPrice" DOUBLE PRECISION NOT NULL,
    "closePrice" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "newPrice" DOUBLE PRECISION NOT NULL,
    "time" VARCHAR(8) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_minute_kline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_index_minute_kline" (
    "id" TEXT NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "period" INTEGER NOT NULL DEFAULT 1,
    "openPrice" DOUBLE PRECISION NOT NULL,
    "highPrice" DOUBLE PRECISION NOT NULL,
    "lowPrice" DOUBLE PRECISION NOT NULL,
    "closePrice" DOUBLE PRECISION NOT NULL,
    "newPrice" DOUBLE PRECISION NOT NULL,
    "time" VARCHAR(8) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_index_minute_kline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_task" (
    "id" TEXT NOT NULL,
    "taskType" TEXT NOT NULL,
    "dataSource" TEXT NOT NULL,
    "batchDate" TIMESTAMP(3) NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 2,
    "status" TEXT NOT NULL,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "duration" INTEGER,
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "errorMsg" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sync_task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stock_basic_code_key" ON "stock_basic"("code");

-- CreateIndex
CREATE INDEX "stock_basic_code_idx" ON "stock_basic"("code");

-- CreateIndex
CREATE INDEX "stock_basic_industry_idx" ON "stock_basic"("industry");

-- CreateIndex
CREATE UNIQUE INDEX "stock_index_basic_code_key" ON "stock_index_basic"("code");

-- CreateIndex
CREATE INDEX "stock_index_basic_code_idx" ON "stock_index_basic"("code");

-- CreateIndex
CREATE INDEX "stock_screener_date_code_idx" ON "stock_screener"("date", "code");

-- CreateIndex
CREATE INDEX "stock_screener_industry_idx" ON "stock_screener"("industry");

-- CreateIndex
CREATE INDEX "stock_screener_concept_idx" ON "stock_screener"("concept");

-- CreateIndex
CREATE INDEX "stock_screener_style_idx" ON "stock_screener"("style");

-- CreateIndex
CREATE INDEX "stock_quotes_code_date_idx" ON "stock_quotes"("code", "date");

-- CreateIndex
CREATE INDEX "stock_quotes_date_idx" ON "stock_quotes"("date");

-- CreateIndex
CREATE INDEX "stock_quotes_code_idx" ON "stock_quotes"("code");

-- CreateIndex
CREATE INDEX "stock_quotes_industry_idx" ON "stock_quotes"("industry");

-- CreateIndex
CREATE UNIQUE INDEX "stock_quotes_date_code_key" ON "stock_quotes"("date", "code");

-- CreateIndex
CREATE INDEX "stock_index_quotes_date_idx" ON "stock_index_quotes"("date");

-- CreateIndex
CREATE INDEX "stock_index_quotes_code_idx" ON "stock_index_quotes"("code");

-- CreateIndex
CREATE INDEX "stock_index_quotes_code_date_idx" ON "stock_index_quotes"("code", "date");

-- CreateIndex
CREATE UNIQUE INDEX "stock_index_quotes_date_code_key" ON "stock_index_quotes"("date", "code");

-- CreateIndex
CREATE INDEX "stock_minute_kline_code_date_idx" ON "stock_minute_kline"("code", "date");

-- CreateIndex
CREATE UNIQUE INDEX "stock_minute_kline_date_time_code_period_key" ON "stock_minute_kline"("date", "time", "code", "period");

-- CreateIndex
CREATE INDEX "stock_index_minute_kline_code_date_idx" ON "stock_index_minute_kline"("code", "date");

-- CreateIndex
CREATE UNIQUE INDEX "stock_index_minute_kline_date_time_code_period_key" ON "stock_index_minute_kline"("date", "time", "code", "period");

-- CreateIndex
CREATE INDEX "sync_task_taskType_batchDate_idx" ON "sync_task"("taskType", "batchDate");

-- CreateIndex
CREATE INDEX "sync_task_taskType_status_idx" ON "sync_task"("taskType", "status");
