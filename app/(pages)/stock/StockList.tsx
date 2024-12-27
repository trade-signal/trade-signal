"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { get } from "@/shared/request";
import { StockSelection } from "@prisma/client";
import { Tabs } from "@mantine/core";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import DataTable from "@/app/components/tables/DataTable";
import { getOrderBy } from "./StockListConfig";

import { StockFilters, useStockContext } from "./StockContext";
import { TAB_CONFIGS } from "./StockListConfig";

const StockList = () => {
  const { filters, setFilters } = useStockContext();

  const [searchValue, setSearchValue] = useState(filters.search || "");

  const [stockList, setStockList] = useState<StockSelection[]>([]);
  const [statistics, setStatistics] = useState<{ date: string }>({ date: "" });

  const [refreshTime, setRefreshTime] = useState<string | undefined>();

  const [loading, { open, close }] = useDisclosure(false);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const getStockList = async (currentPage: number, hasMore: boolean) => {
    if (!hasMore || (currentPage > 1 && loading)) return;

    if (currentPage === 1) {
      open();
    }

    const response = await get("/api/stock-selection/list", {
      ...filters,
      page: currentPage,
      pageSize: filters.pageSize || 20,
      search: filters.search || "",
      industries: filters.industries?.join(","),
      concepts: filters.concepts?.join(",")
    });

    if (currentPage === 1) {
      setIsFirstLoading(false);
    }

    if (response.success) {
      const { data, pagination } = response;
      if (currentPage === 1) {
        setStockList(data);
        setTotal(pagination.total);
        setStatistics(response.statistics);
      } else {
        setStockList(prev => [...prev, ...data]);
      }
      setHasMore(currentPage < pagination.totalPage);
    }

    close();
  };

  const handleFilterChange = (newFilters: Partial<StockFilters>) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  type SortOrder = "asc" | "desc";

  const handleSort = (key: string) => {
    const { orderBy, order } = filters;

    const newOrder: SortOrder =
      key === orderBy ? (order === "asc" ? "desc" : "asc") : "desc";

    handleFilterChange({
      orderBy: key,
      order: newOrder
    });
  };

  const handleSearch = useDebouncedCallback(value => {
    handleFilterChange({ search: value });
  }, 500);

  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);
    handleSearch(value);
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
    getStockList(1, true);
  }, [filters]);

  useEffect(() => {
    if (page > 1 && !loading) {
      getStockList(page, hasMore);
    }
  }, [page]);

  const getBatchInfo = async () => {
    const response = await get("/api/batch", {});

    if (response.success) {
      const batch = response.data.find(
        (item: any) => item.type === "stock_selection"
      );
      setRefreshTime(dayjs(batch.batchTime).format("YYYY-MM-DD HH:mm"));
    }
  };

  useEffect(() => {
    getBatchInfo();
  }, []);

  return (
    <Tabs defaultValue="overview">
      <Tabs.List>
        {TAB_CONFIGS.map(tab => (
          <Tabs.Tab key={tab.value} value={tab.value}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {TAB_CONFIGS.map(tab => (
        <Tabs.Panel key={tab.value} value={tab.value}>
          <DataTable
            columns={tab.columns}
            data={stockList}
            firstLoading={isFirstLoading}
            loading={loading}
            total={total}
            statisticsDate={statistics.date}
            refreshTime={refreshTime}
            orderBy={filters.orderBy}
            order={filters.order}
            search={searchValue}
            onSort={handleSort}
            onSearch={handleSearchValueChange}
            onLoadMore={handleLoadMore}
            getOrderBy={getOrderBy}
          />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};

export default StockList;
