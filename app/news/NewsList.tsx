"use client";

import { useEffect, useState } from "react";
import { get } from "@/shared/request";
import { useDisclosure } from "@mantine/hooks";
import { Stack } from "@mantine/core";

import { useNewsContext } from "./NewsContext";

const NewsList = () => {
  const { filters } = useNewsContext();

  const [newsList, setNewsList] = useState<News[]>([]);

  const [loading, { open, close }] = useDisclosure(false);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const getNewsList = async (currentPage: number, hasMore: boolean) => {
    if (!hasMore || (currentPage > 1 && loading)) return;

    if (currentPage === 1) {
      open();
    }

    const response = await get("/api/news/list", {
      ...filters,
      page: currentPage,
      pageSize: filters.pageSize || 20,
      tags: filters.tags?.join(",")
    });

    if (currentPage === 1) {
      setIsFirstLoading(false);
    }

    if (response.success) {
      const { data, pagination } = response;
      if (currentPage === 1) {
        setNewsList(data);
        setTotal(pagination.total);
      } else {
        setNewsList(prev => [...prev, ...data]);
      }
      setHasMore(currentPage < pagination.totalPage);
    }

    close();
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    open();
    setPage(1);
    setHasMore(true);
    getNewsList(1, true);
  }, [filters]);

  useEffect(() => {
    if (page > 1 && !loading) {
      getNewsList(page, hasMore);
    }
  }, [page]);

  return <Stack>123</Stack>;
};

export default NewsList;
