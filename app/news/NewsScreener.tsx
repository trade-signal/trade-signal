"use client";

import { useEffect, useState } from "react";
import { Stack, Group, Title, Button } from "@mantine/core";
import { get } from "@/shared/request";

import ScreenerMultiSelect from "@/app/components/ScreenerMultiSelect";
import { getInitialFilters, NewsFilters, useNewsContext } from "./NewsContext";

const NewsScreener = () => {
  const { filters, setFilters } = useNewsContext();

  const [tags, setTags] = useState<Tag[]>([]);

  const handleFilterChange = (newFilters: Partial<NewsFilters>) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const getFilter = async () => {
    const response = await get("/api/news/filter", {});

    if (response.success) {
      setTags(response.data.tags);
    }
  };

  useEffect(() => {
    getFilter();
  }, []);

  return (
    <Stack mt={10} mb={10}>
      <Title order={5}>新闻筛选器</Title>

      <Group>
        <ScreenerMultiSelect
          title="标签"
          value={filters.tags}
          data={tags}
          onChange={tags => handleFilterChange({ tags })}
          clearable
          searchable
          nothingFoundMessage="未找到相关标签"
        />
      </Group>
    </Stack>
  );
};

export default NewsScreener;
