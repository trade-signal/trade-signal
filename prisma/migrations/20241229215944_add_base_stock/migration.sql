-- CreateTable
CREATE TABLE "stock" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "industry" VARCHAR(50) NOT NULL,
    "listingDate" VARCHAR(10) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stock_code_key" ON "stock"("code");

-- CreateIndex
CREATE INDEX "stock_code_idx" ON "stock"("code");

-- CreateIndex
CREATE INDEX "stock_industry_idx" ON "stock"("industry");

-- CreateIndex
CREATE INDEX "stock_status_idx" ON "stock"("status");
