"use client";

import { useEffect, useState } from "react";
import { Stack, Group, Title, SegmentedControl, Text } from "@mantine/core";
import { get } from "@/shared/request";

import ScreenerSelect from "@/app/components/ScreenerSelect";
import StockScreenerMultiSelect, {
  DataItem
} from "@/app/components/ScreenerMultiSelect";
import { getCategoryName } from "@/cron/news/cls";
import { NewsFilters, useNewsContext } from "./NewsContext";
import { SOURCE_MAP } from "./NewsListConfig";

interface SourceFilter {
  categories: string[];
}

const SOURCE_OPTIONS = [
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

  const [sourceFilters, setSourceFilters] = useState<{
    [key: string]: SourceFilter;
  }>({});
  const [categories, setCategories] = useState<DataItem[]>([]);

  const getFilter = async () => {
    const response = await get("/api/news/filter", {});

    if (response.success) {
      setSourceFilters(response.data);
    }
  };

  useEffect(() => {
    getFilter();
  }, []);

  useEffect(() => {
    handleSourceChange(filters.source || "sina");
  }, [sourceFilters]);

  const handleSourceChange = (source: string | null) => {
    if (source) {
      const sourceFilter = sourceFilters[source] || { categories: [] };

      switch (source) {
        case "sina": // 新浪财经
          setCategories([
            {
              label: "全部",
              value: ""
            },
            ...sourceFilter.categories.map(item => ({
              label: item,
              value: item
            }))
          ]);
          break;
        case "cls": // 财联社
          setCategories([
            {
              label: "全部",
              value: ""
            },
            ...sourceFilter.categories.map(item => ({
              label: getCategoryName(item) as string,
              value: item
            }))
          ]);
          break;
        default:
          break;
      }

      handleFilterChange({
        source,
        categories: []
      });
      return;
    }

    setCategories([]);
    handleFilterChange({ source: undefined, categories: [] });
  };

  return (
    <Stack mt={10} mb={10}>
      <Title order={5}>新闻筛选器</Title>

      <Group>
        <ScreenerSelect
          title="来源"
          value={filters.source}
          data={SOURCE_OPTIONS}
          onChange={source => handleSourceChange(source)}
        />

        <SegmentedControl
          withItemsBorders={false}
          size="md"
          radius="md"
          color="indigo"
          styles={{
            root: {
              background: "transparent"
            },
            control: {
              padding: 0
            }
          }}
          value={filters.categories?.[0] || ""}
          data={categories}
          onChange={category => handleFilterChange({ categories: [category] })}
        />
      </Group>
    </Stack>
  );
};

export default NewsScreener;
