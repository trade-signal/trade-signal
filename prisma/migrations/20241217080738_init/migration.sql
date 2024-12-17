-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "image" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "refresh_token_expires_in" INTEGER,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_token" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "stock_selection" (
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

    CONSTRAINT "stock_selection_pkey" PRIMARY KEY ("date","code")
);

-- CreateTable
CREATE TABLE "news" (
    "id" TEXT NOT NULL,
    "source" VARCHAR(255) NOT NULL,
    "sourceId" VARCHAR(255) NOT NULL,
    "sourceUrl" VARCHAR(1000),
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tags" VARCHAR(1000) NOT NULL,
    "stocks" VARCHAR(2000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "session_sessionToken_key" ON "session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_token_key" ON "verification_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_identifier_token_key" ON "verification_token"("identifier", "token");

-- CreateIndex
CREATE INDEX "stock_selection_date_code_idx" ON "stock_selection"("date", "code");

-- CreateIndex
CREATE INDEX "stock_selection_industry_idx" ON "stock_selection"("industry");

-- CreateIndex
CREATE INDEX "stock_selection_concept_idx" ON "stock_selection"("concept");

-- CreateIndex
CREATE INDEX "stock_selection_style_idx" ON "stock_selection"("style");

-- CreateIndex
CREATE INDEX "news_date_idx" ON "news"("date");

-- CreateIndex
CREATE INDEX "news_source_sourceId_idx" ON "news"("source", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "news_source_sourceId_key" ON "news"("source", "sourceId");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
