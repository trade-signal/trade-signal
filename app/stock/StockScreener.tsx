"use client";

import { StockFilters, useStockContext } from "./StockContext";
import { Select, SimpleGrid, Stack, Title } from "@mantine/core";

const StockScreener = () => {
  const { filters, setFilters } = useStockContext();

  const handleFilterChange = (newFilters: Partial<StockFilters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <Stack mt={10} mb={10}>
      <Title order={5}>股票筛选器</Title>
      <SimpleGrid cols={8}>
        <Select
          value={filters.industry}
          onChange={industry => handleFilterChange({ industry })}
          checkIconPosition="right"
          data={["全部行业", "科技", "金融", "医疗", "制造"]}
        />
      </SimpleGrid>
    </Stack>
  );
};

export default StockScreener;
