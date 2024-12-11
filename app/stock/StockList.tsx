"use client";

import { useEffect, useState } from "react";
import { get } from "@/shared/request";
import { StockSelection } from "@prisma/client";
import {
  Group,
  LoadingOverlay,
  Pagination,
  Table,
  Text,
  Tabs
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { StockFilters, useStockContext } from "./StockContext";

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
}

interface Column {
  key: keyof StockSelection;
  title: string;
  render?: (value: any) => React.ReactNode;
}

interface TabConfig {
  value: string;
  label: string;
  columns: Column[];
}

const formatNumber = (value: number, decimals = 2) => value.toFixed(decimals);
const formatBillion = (value: number) => (value / 100000000).toFixed(2);

const TAB_CONFIGS: TabConfig[] = [
  {
    value: "overview",
    label: "概览",
    columns: [
      { key: "code", title: "股票代码" },
      { key: "name", title: "股票名称" },
      { key: "newPrice", title: "最新价", render: formatNumber },
      { key: "changeRate", title: "涨跌幅(%)", render: formatNumber },
      { key: "totalMarketCap", title: "总市值(亿)", render: formatBillion }
    ]
  },
  {
    value: "valuation",
    label: "估值指标",
    columns: [
      { key: "code", title: "股票代码" },
      { key: "name", title: "股票名称" },
      { key: "pe9", title: "市盈率TTM", render: formatNumber },
      { key: "pbnewmrq", title: "市净率", render: formatNumber },
      { key: "totalMarketCap", title: "总市值(亿)", render: formatBillion },
      { key: "freeCap", title: "流通市值(亿)", render: formatBillion },
      { key: "zxgxl", title: "股息率(%)", render: formatNumber }
    ]
  },
  {
    value: "growth",
    label: "成长指标",
    columns: [
      { key: "code", title: "股票代码" },
      { key: "name", title: "股票名称" },
      { key: "toiYoyRatio", title: "营收增长率(%)", render: formatNumber },
      {
        key: "netprofitYoyRatio",
        title: "净利润增长率(%)",
        render: formatNumber
      },
      { key: "saleGpr", title: "毛利率(%)", render: formatNumber },
      { key: "roeWeight", title: "ROE(%)", render: formatNumber },
      { key: "jroa", title: "ROA(%)", render: formatNumber }
    ]
  }
];

const TableContainer = ({ children }: { children: React.ReactNode }) => (
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
    <Table stickyHeader verticalSpacing="xs">
      {children}
    </Table>
  </Table.ScrollContainer>
);

const StockTable = ({
  columns,
  data,
  loading
}: {
  columns: Column[];
  data: StockSelection[];
  loading: boolean;
}) => (
  <TableContainer>
    <LoadingOverlay
      visible={loading}
      zIndex={1000}
      overlayProps={{ radius: "sm", blur: 2 }}
    />
    <Table.Thead>
      <Table.Tr>
        {columns.map(column => (
          <Table.Th key={column.key}>{column.title}</Table.Th>
        ))}
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {data.map(stock => (
        <Table.Tr key={stock.code}>
          {columns.map(column => (
            <Table.Td key={column.key}>
              {column.render
                ? column.render(stock[column.key])
                : String(stock[column.key])}
            </Table.Td>
          ))}
        </Table.Tr>
      ))}
    </Table.Tbody>
  </TableContainer>
);

const PaginationFooter = ({
  pagination,
  onPageChange
}: {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}) => (
  <Group>
    <Pagination
      mt="sm"
      color="gray"
      value={pagination.page}
      total={pagination.totalPage}
      onChange={onPageChange}
    />
    <Group>
      <Text size="xs" mt="md">
        共 {pagination?.total || 0} 条数据
      </Text>
      <Text size="xs" mt="md">
        第 {pagination?.page || 1} 页 共 {pagination?.totalPage || 1} 页
      </Text>
    </Group>
  </Group>
);

const StockList = () => {
  const { filters, setFilters } = useStockContext();
  const [visible, { open, close }] = useDisclosure(false);
  const [stockList, setStockList] = useState<StockSelection[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPage: 0
  });

  const getStockList = async () => {
    if (!filters.page || !filters.pageSize) return;

    const response = await get("/api/stock/list", {
      ...filters,
      industries: filters.industries?.join(","),
      concepts: filters.concepts?.join(",")
    });

    if (response.success) {
      const { data, pagination } = response;
      setStockList(data);
      setPagination(pagination);
    }
  };

  const handleFilterChange = (newFilters: Partial<StockFilters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  useEffect(() => {
    (async () => {
      open();
      await getStockList();
      close();
    })();
  }, [filters]);

  return (
    <>
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
            <StockTable
              columns={tab.columns}
              data={stockList}
              loading={visible}
            />
          </Tabs.Panel>
        ))}
      </Tabs>

      <PaginationFooter
        pagination={pagination}
        onPageChange={page => handleFilterChange({ page })}
      />
    </>
  );
};

export default StockList;
