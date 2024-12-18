"use client";

import { StockSelection } from "@prisma/client";
import { Group, Text } from "@mantine/core";
import DataTable from "@/app/components/tables/DataTable";
import { Column } from "@/app/components/tables/DataTable/types";
import { getOrderBy } from "./StockListConfig";

const StockTable = ({
  columns,
  data,
  firstLoading,
  loading,
  onLoadMore,
  total,
  statisticsDate,
  orderBy,
  order,
  search,
  onSort,
  onSearch
}: {
  columns: Column<StockSelection>[];
  data: StockSelection[];
  firstLoading: boolean;
  loading: boolean;
  total: number;
  statisticsDate?: string;
  orderBy?: string;
  order?: string;
  search?: string;
  onLoadMore: () => void;
  onSort: (key: string) => void;
  onSearch: (value: string) => void;
}) => (
  <DataTable
    columns={columns}
    data={data}
    firstLoading={firstLoading}
    loading={loading}
    total={total}
    orderBy={orderBy}
    order={order}
    search={search}
    onLoadMore={onLoadMore}
    onSort={onSort}
    onSearch={onSearch}
    statisticsDate={statisticsDate}
    getOrderBy={getOrderBy}
  />
);

export default StockTable;
