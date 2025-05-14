"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { formatDateDiff, get } from "@trade-signal/shared";
import { News } from "@prisma/client";
import { useDisclosure } from "@mantine/hooks";
import DataTable from "@/app/components/DataTable";

import { useNewsContext } from "./NewsContext";
import { COLUMNS } from "./NewsListConfig";

const NewsList = props => {
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
      source: filters.source || "",
      categories: filters.categories?.join(",")
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

  const latestTime = newsList[0]?.createdAt;

  return (
    <DataTable
      height="calc(100vh - 255px)"
      columns={COLUMNS}
      data={newsList}
      refreshTime={formatDateDiff(latestTime).date}
      firstLoading={isFirstLoading}
      loading={loading}
      total={total}
      onLoadMore={handleLoadMore}
    />
  );
};

export default NewsList;
