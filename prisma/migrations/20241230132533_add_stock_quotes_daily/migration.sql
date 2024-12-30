-- CreateTable
CREATE TABLE "stock_quotes_daily" (
    "id" TEXT NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "openPrice" DOUBLE PRECISION NOT NULL,
    "highPrice" DOUBLE PRECISION NOT NULL,
    "lowPrice" DOUBLE PRECISION NOT NULL,
    "closePrice" DOUBLE PRECISION NOT NULL,
    "preClosePrice" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "dealAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_quotes_daily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "stock_quotes_daily_date_idx" ON "stock_quotes_daily"("date");

-- CreateIndex
CREATE INDEX "stock_quotes_daily_code_idx" ON "stock_quotes_daily"("code");

-- CreateIndex
CREATE UNIQUE INDEX "stock_quotes_daily_date_code_key" ON "stock_quotes_daily"("date", "code");
