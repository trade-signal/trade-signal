-- CreateTable
CREATE TABLE "stock_active" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "marketId" INTEGER NOT NULL,
    "lastViewAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "stock_index_active" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "marketId" INTEGER NOT NULL,
    "lastViewAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "stock_active_code_key" ON "stock_active"("code");

-- CreateIndex
CREATE INDEX "stock_active_lastViewAt_idx" ON "stock_active"("lastViewAt");

-- CreateIndex
CREATE UNIQUE INDEX "stock_index_active_code_key" ON "stock_index_active"("code");

-- CreateIndex
CREATE INDEX "stock_index_active_lastViewAt_idx" ON "stock_index_active"("lastViewAt");
