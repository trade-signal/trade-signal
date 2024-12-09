"use client";

import { useEffect, useState } from "react";
import { SimpleGrid, Stack, Title, MultiSelect } from "@mantine/core";
import { get } from "@/shared/request";
import { StockFilters, useStockContext } from "./StockContext";

const StockScreener = () => {
  const { filters, setFilters } = useStockContext();

  const handleFilterChange = (newFilters: Partial<StockFilters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const [industryData, setIndustryData] = useState<string[]>([]);
  const [conceptData, setConceptData] = useState<string[]>([]);

  const getFilter = async () => {
    const response = await get("/api/stock/filter", {});

    if (response.success) {
      setIndustryData(response.data.industries);
      setConceptData(response.data.concepts);
    }
  };

  useEffect(() => {
    getFilter();
  }, []);

  return (
    <Stack mt={10} mb={10}>
      <Title order={5}>股票筛选器</Title>
      <SimpleGrid cols={6}>
        <MultiSelect
          value={filters.industries}
          placeholder="行业"
          onChange={industries => handleFilterChange({ industries })}
          checkIconPosition="right"
          data={industryData}
          searchable
        />

        <MultiSelect
          value={filters.concepts}
          placeholder="概念"
          onChange={concepts => handleFilterChange({ concepts })}
          checkIconPosition="right"
          data={conceptData}
          searchable
        />
      </SimpleGrid>
    </Stack>
  );
};

export default StockScreener;
