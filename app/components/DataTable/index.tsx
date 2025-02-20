import { Box, LoadingOverlay } from "@mantine/core";
import { Column } from "@/app/types/column.type";

import DataTableContainer from "./DataTableContainer";
import DataTableHeader from "./DataTableHeader";
import DataTableBody from "./DataTableBody";
import DataTableFooter from "./DataTableFooter";

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total: number;

  loading: boolean;
  firstLoading: boolean;

  height?: string;
  statisticsDate?: string;
  refreshTime?: string;

  orderBy?: string;
  order?: string;
  getOrderBy?: (orderBy: string, order?: string) => string;

  search?: string;
  onRowClick?: (row: T) => void;
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
  refreshTime,
  orderBy,
  order,
  getOrderBy,
  search,
  onLoadMore,
  onSort,
  onSearch,
  onRowClick
}: DataTableProps<T>) => (
  <Box pos="relative">
    <LoadingOverlay
      visible={firstLoading || loading}
      loaderProps={{ size: "sm", type: firstLoading ? "bars" : "oval" }}
      zIndex={1000}
      overlayProps={{
        radius: "sm",
        blur: firstLoading ? 2 : 0
      }}
    />

    <DataTableContainer onLoadMore={onLoadMore} height={height}>
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
        onRowClick={onRowClick}
      />
    </DataTableContainer>

    <DataTableFooter
      firstLoading={firstLoading}
      total={total}
      dataLength={data.length}
      statisticsDate={statisticsDate}
      refreshTime={refreshTime}
      orderBy={orderBy}
      order={order}
      getOrderBy={getOrderBy}
    />
  </Box>
);

export default DataTable;
