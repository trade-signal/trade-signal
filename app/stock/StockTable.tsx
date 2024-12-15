import { useEffect } from "react";
import { StockSelection } from "@prisma/client";
import { LoadingOverlay, Table, Text, Group, Button } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";

export interface Column {
  key: keyof StockSelection;
  title: string;
  width?: number;
  render?: (value: any) => React.ReactNode;
  sortable?: boolean;
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

const StockTable = ({
  columns,
  data,
  loading,
  onLoadMore,
  total,
  pageSize = 20,
  statisticsDate,
  orderBy,
  order,
  onSort
}: {
  columns: Column[];
  data: StockSelection[];
  loading: boolean;
  total: number;
  pageSize?: number;
  statisticsDate?: string;
  orderBy?: string;
  order?: string;
  onLoadMore: () => void;
  onSort: (key: string) => void;
}) => (
  <>
    <TableContainer onLoadMore={onLoadMore}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Table.Thead>
        <Table.Tr>
          <Table.Th style={{ width: 60 }}>序号</Table.Th>
          {columns.map(column => (
            <Table.Th
              key={column.key}
              style={{ width: column.width, cursor: "pointer" }}
              onClick={() => onSort(column.key)}
            >
              <Group gap={4}>
                {column.title}
                {column.sortable && orderBy === column.key && (
                  <Button variant="transparent" size="compact-xs">
                    {order === "asc" ? (
                      <IconSortAscending size={12} />
                    ) : (
                      <IconSortDescending size={12} />
                    )}
                  </Button>
                )}
              </Group>
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map((stock, index) => (
          <Table.Tr key={stock.code}>
            <Table.Td>{index + 1}</Table.Td>
            {columns.map(column => (
              <Table.Td key={column.key} style={{ width: column.width }}>
                {column.render
                  ? column.render(stock[column.key])
                  : String(stock[column.key])}
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </TableContainer>
    <Group justify="flex-end" mt="sm">
      <Text size="sm" c="dimmed">
        共 {total} 条数据 · {Math.ceil(total / pageSize)} 页 (已加载{" "}
        {Math.ceil(data.length / pageSize)} 页)
      </Text>
      <Text size="sm" c="dimmed">
        数据更新时间: {statisticsDate}
      </Text>
    </Group>
  </>
);

export default StockTable;
