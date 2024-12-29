-- CreateIndex
CREATE INDEX "stock_real_time_industry_idx" ON "stock_real_time"("industry");

-- CreateIndex
CREATE INDEX "stock_real_time_code_date_idx" ON "stock_real_time"("code", "date");

-- CreateIndex
CREATE INDEX "stock_real_time_code_date_industry_idx" ON "stock_real_time"("code", "date", "industry");
