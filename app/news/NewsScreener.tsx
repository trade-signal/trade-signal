"use client";

import { useEffect, useState } from "react";
import { Stack, Group, Title, SegmentedControl, Text } from "@mantine/core";
import { get } from "@/shared/request";

import ScreenerSelect from "@/app/components/ScreenerSelect";
import StockScreenerMultiSelect from "@/app/components/ScreenerMultiSelect";
import { NewsFilters, useNewsContext } from "./NewsContext";
import { SOURCE_MAP } from "./NewsListConfig";

const SOURCE_OPTIONS = [
  {
    value: "",
    label: "全部"
  },
  ...Object.entries(SOURCE_MAP).map(([value, label]) => ({
    value,
    label
  }))
];

const NewsScreener = () => {
  const { filters, setFilters } = useNewsContext();

  const handleFilterChange = (newFilters: Partial<NewsFilters>) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const [categories, setCategories] = useState<string[]>(["全部"]);

  const getFilter = async () => {
    const response = await get("/api/news/filter", {});

    if (response.success) {
      // setCategories(["全部", ...response.data.categories]);
    }
  };

  useEffect(() => {
    getFilter();
  }, []);

  return (
    <Stack mt={10} mb={10}>
      <Title order={5}>新闻筛选器</Title>

      <Group>
        <ScreenerSelect
          title="来源"
          value={filters.source}
          data={SOURCE_OPTIONS}
          onChange={source => handleFilterChange({ source })}
        />

        <StockScreenerMultiSelect
          title="分类"
          value={filters.categories}
          data={categories}
          onChange={categories => handleFilterChange({ categories })}
          clearable
          searchable
          nothingFoundMessage="未找到相关分类"
        />
      </Group>
    </Stack>
  );
};

export default NewsScreener;
