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

  const [industries, setIndustries] = useState<string[]>([]);
  const [concepts, setConcepts] = useState<string[]>([]);

  const getFilter = async () => {
    const response = await get("/api/stock/filter", {});

    if (response.success) {
      setIndustries(response.data.industries);
      setConcepts(response.data.concepts);
    }
  };

  useEffect(() => {
    getFilter();
  }, []);

  return (
    <Stack mt={10} mb={10}>
      <Title order={5}>股票筛选器</Title>
      <SimpleGrid cols={8}>
        <MultiSelect
          value={filters.industry}
          placeholder="请选择行业"
          onChange={industry => handleFilterChange({ industry })}
          checkIconPosition="right"
          data={industries}
          searchable
        />

        <MultiSelect
          value={filters.concept}
          placeholder="请选择概念"
          onChange={concept => handleFilterChange({ concept })}
          checkIconPosition="right"
          data={concepts}
          searchable
        />
      </SimpleGrid>
    </Stack>
  );
};

export default StockScreener;
