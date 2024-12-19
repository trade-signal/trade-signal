"use client";

import { useEffect, useState } from "react";
import { Stack, Group, Title, SegmentedControl, Text } from "@mantine/core";
import { get } from "@/shared/request";

import { NewsFilters, useNewsContext } from "./NewsContext";

const NewsScreener = () => {
  const { filters, setFilters } = useNewsContext();

  const handleFilterChange = (newFilters: Partial<NewsFilters>) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const [tags, setTags] = useState<string[]>(["全部"]);

  const getFilter = async () => {
    const response = await get("/api/news/filter", {});

    if (response.success) {
      setTags(["全部", ...response.data.tags]);
    }
  };

  useEffect(() => {
    getFilter();
  }, []);

  return (
    <Stack mt={10} mb={10}>
      <Title order={5}>新闻筛选器</Title>

      <Group>
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
          value={filters.tags?.[0] || "全部"}
          data={tags}
          onChange={tag => handleFilterChange({ tags: [tag] })}
        />
      </Group>
    </Stack>
  );
};

export default NewsScreener;
