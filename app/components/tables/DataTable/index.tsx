import { Box, LoadingOverlay } from "@mantine/core";

import DataTableContainer from "./DataTableContainer";
import DataTableHeader from "./DataTableHeader";
import DataTableBody from "./DataTableBody";
import DataTableFooter from "./DataTableFooter";
import { Column } from "./types";

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total: number;

  loading: boolean;
  firstLoading: boolean;

  height?: string;
  statisticsDate?: string;

  orderBy?: string;
  order?: string;
  getOrderBy?: (orderBy: string, order?: string) => string;

  search?: string;

  onLoadMore: () => void;
  onSort?: (key: string) => void;
  onSearch?: (value: string) => void;
}

const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  total,
  loading,
  firstLoading,
  height,
  statisticsDate,
  orderBy,
  order,
  getOrderBy,
  search,
  onLoadMore,
  onSort,
  onSearch
}: DataTableProps<T>) => (
  <Box>
    <DataTableContainer onLoadMore={onLoadMore} height={height}>
      <LoadingOverlay
        visible={firstLoading || loading}
        loaderProps={{ size: "sm", type: firstLoading ? "bars" : "oval" }}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: firstLoading ? 2 : 0 }}
      />
      <DataTableHeader
        columns={columns}
        orderBy={orderBy}
        order={order}
        search={search}
        onSort={onSort}
        onSearch={onSearch}
      />
      <DataTableBody
        columns={columns}
        data={data}
        orderBy={orderBy}
        order={order}
      />
    </DataTableContainer>
    <DataTableFooter
      firstLoading={firstLoading}
      total={total}
      dataLength={data.length}
      statisticsDate={statisticsDate}
      orderBy={orderBy}
      order={order}
      getOrderBy={getOrderBy}
    />
  </Box>
);

export default DataTable;
