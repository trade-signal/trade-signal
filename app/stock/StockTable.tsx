import { useEffect } from "react";
import { StockSelection } from "@prisma/client";
import {
  LoadingOverlay,
  Table,
  Text,
  Group,
  Button,
  TextInput
} from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import {
  IconSearch,
  IconSortAscending,
  IconSortDescending
} from "@tabler/icons-react";
import { getOrderBy } from "./StockListConfig";

export interface Column {
  key: keyof StockSelection;
  title: string;
  width?: number;
  render?: (value: any) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  align?: "left" | "center" | "right";
}

const TableContainer = ({
  children,
  onLoadMore
}: {
  children: React.ReactNode;
  onLoadMore: () => void;
}) => {
  const { ref, entry } = useIntersection({
    threshold: 0.5
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      onLoadMore();
    }
  }, [entry?.isIntersecting]);

  return (
    <Table.ScrollContainer
      pos="relative"
      minWidth={500}
      style={{
        height: "calc(100vh - 240px)",
        width: "100%",
        overflow: "auto",
        borderBottom: "1px solid #eee"
      }}
    >
      <Table stickyHeader highlightOnHover verticalSpacing="xs">
        {children}
      </Table>
      <div ref={ref} style={{ height: "20px" }} />
    </Table.ScrollContainer>
  );
};

const ColumnSortCell = ({
  column,
  orderBy,
  order
}: {
  column: Column;
  orderBy?: string;
  order?: string;
}) => {
  return (
    <Group gap={2} style={{ cursor: "pointer", flexWrap: "nowrap" }}>
      <Text fw="normal" size="sm" style={{ whiteSpace: "nowrap" }}>
        {column.title}
      </Text>
      {column.sortable && orderBy === column.key && (
        <Button variant="transparent" size="compact-xs" pr={0} mr={0}>
          {order === "asc" ? (
            <IconSortAscending size={18} />
          ) : (
            <IconSortDescending size={18} />
          )}
        </Button>
      )}
    </Group>
  );
};

const transformAlign = (align: Column["align"]) => {
  if (align === "left") return "flex-start";
  if (align === "right") return "flex-end";
  return "center";
};

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
  columns: Column[];
  data: StockSelection[];
  firstLoading: boolean;
  loading: boolean;
  total: number;
  pageSize?: number;
  statisticsDate?: string;
  orderBy?: string;
  order?: string;
  search?: string;
  onLoadMore: () => void;
  onSort: (key: string) => void;
  onSearch: (value: string) => void;
}) => (
  <>
    <TableContainer onLoadMore={onLoadMore}>
      <LoadingOverlay
        visible={firstLoading || loading}
        loaderProps={{ size: "sm", type: firstLoading ? "bars" : "oval" }}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: firstLoading ? 2 : 0 }}
      />
      <Table.Thead>
        <Table.Tr>
          {columns.map(column => (
            <Table.Th
              key={column.key}
              fw="normal"
              fz="sm"
              c="#666"
              style={{
                width: column.width,
                cursor: "pointer"
              }}
              onClick={() => onSort(column.key)}
            >
              <Group
                gap={4}
                style={{ justifyContent: transformAlign(column.align) }}
              >
                {column.searchable ? (
                  <TextInput
                    size="xs"
                    label={
                      <ColumnSortCell
                        column={column}
                        orderBy={orderBy}
                        order={order}
                      />
                    }
                    variant="filled"
                    placeholder="搜索"
                    rightSection={<IconSearch size={18} />}
                    value={search}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onChange={e => {
                      onSearch(e.target.value);
                    }}
                  />
                ) : (
                  <ColumnSortCell
                    column={column}
                    orderBy={orderBy}
                    order={order}
                  />
                )}
              </Group>
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map((stock, index) => (
          <Table.Tr key={`${stock.code}-${index}-${orderBy}-${order}`}>
            {columns.map(column => (
              <Table.Td
                key={column.key}
                style={{ width: column.width }}
                align={column.align}
              >
                {column.render
                  ? column.render(stock[column.key])
                  : String(stock[column.key])}
              </Table.Td>
            ))}
          </Table.Tr>
        ))}

        {data.length === 0 && (
          <Table.Tr h={300}>
            <Table.Td colSpan={columns.length} style={{ textAlign: "center" }}>
              <Text size="sm" c="dimmed">
                暂无数据
              </Text>
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </TableContainer>
    <Group justify="flex-end" mt="sm" gap="xs" style={{ height: 30 }}>
      {firstLoading ? (
        <Text size="sm" c="dimmed">
          数据加载中...
        </Text>
      ) : (
        <Text size="sm" c="dimmed">
          {statisticsDate && `${statisticsDate} · `}
          {orderBy && `${getOrderBy(orderBy, order)} · `}共 {total} 条记录 (
          {data.length}/{total})
        </Text>
      )}
    </Group>
  </>
);

export default StockTable;
