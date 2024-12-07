"use client";

import { useState, useEffect } from "react";
import { useStockContext } from "./StockContext";
import { Select, SimpleGrid, TextInput } from "@mantine/core";

const StockScreener = () => {
  const { filters, setFilters } = useStockContext();

  const handleFilterChange = (newFilters: Partial<StockFilters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <SimpleGrid cols={5} mb={10} mt={10}>
      <Select
        size="xs"
        value={filters.industry}
        onChange={industry => handleFilterChange({ industry })}
        checkIconPosition="right"
        data={["全部行业", "科技", "金融", "医疗", "制造"]}
      />
    </SimpleGrid>
  );
};

export default StockScreener;
