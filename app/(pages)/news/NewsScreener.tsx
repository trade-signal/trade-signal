"use client";

import { useEffect, useState } from "react";
import { Stack, Group, Title, SegmentedControl, useMantineTheme } from "@mantine/core";
import { get } from "@/shared/request";

import ScreenerSelect, { DataItem } from "@/app/components/ScreenerSelect";
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
  const theme = useMantineTheme();

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
      setSinaCategories(response.data.sina);
    }
  };

  useEffect(() => {
    getFilter();
  }, []);

  const setSinaCategories = (sourceFilter: SourceFilter) => {
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
  };

  const setClsCategories = (sourceFilter: SourceFilter) => {
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
  };

  const handleSourceChange = (source: string | null) => {
    if (source) {
      const sourceFilter = sourceFilters[source] || { categories: [] };

      switch (source) {
        case "sina": // 新浪财经
          setSinaCategories(sourceFilter);
          break;
        case "cls": // 财联社
          setClsCategories(sourceFilter);
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
      <Title order={5}>新闻流</Title>

      <Group mih={45}>
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
          color={theme.primaryColor}
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
