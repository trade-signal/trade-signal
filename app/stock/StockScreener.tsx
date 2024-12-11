"use client";

import { useEffect, useState } from "react";
import { Stack, Group, Title, MultiSelect, Text } from "@mantine/core";
import { get } from "@/shared/request";

import ComboboxMultiSelect from "@/app/components/ComboboxMultiSelect";
import { StockFilters, useStockContext } from "./StockContext";

const StockScreener = () => {
  const { filters, setFilters } = useStockContext();

  const handleFilterChange = (newFilters: Partial<StockFilters>) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const [industryData, setIndustryData] = useState<string[]>([]);
  const [conceptData, setConceptData] = useState<string[]>([]);
  const [styleData, setStyleData] = useState<string[]>([]);

  const getFilter = async () => {
    const response = await get("/api/stock/filter", {});

    if (response.success) {
      setIndustryData(response.data.industries);
      setConceptData(response.data.concepts);
      setStyleData(response.data.styles);
    }
  };

  useEffect(() => {
    getFilter();
  }, []);

  return (
    <Stack mt={10} mb={10}>
      <Title order={5}>股票筛选器</Title>

      <Group>
        <ComboboxMultiSelect
          title="行业"
          value={filters.industries}
          data={industryData}
          onChange={industries => handleFilterChange({ industries })}
          clearable
          searchable
          nothingFoundMessage="未找到相关行业"
        />

        <ComboboxMultiSelect
          title="概念"
          value={filters.concepts}
          data={conceptData}
          onChange={concepts => handleFilterChange({ concepts })}
          clearable
          searchable
          nothingFoundMessage="未找到相关概念"
        />

        <ComboboxMultiSelect
          title="风格"
          value={filters.styles}
          data={styleData}
          onChange={styles => handleFilterChange({ styles })}
          clearable
          searchable
          nothingFoundMessage="未找到相关风格"
        />
      </Group>
    </Stack>
  );
};

export default StockScreener;
