"use client";

import { useEffect, useState } from "react";
import { get } from "@/shared/request";
import { StockSelection } from "@prisma/client";
import { LoadingOverlay, Table, Text, Tabs, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useStockContext } from "./StockContext";
import { useIntersection } from "@mantine/hooks";

interface Column {
  key: keyof StockSelection;
  title: string;
  width?: number;
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
      { key: "code", title: "股票代码", width: 100 },
      { key: "name", title: "股票名称", width: 120 },
      { key: "industry", title: "所属行业", width: 120 },
      { key: "newPrice", title: "最新价", width: 90, render: formatNumber },
      {
        key: "changeRate",
        title: "涨跌幅(%)",
        width: 100,
        render: formatNumber
      },
      {
        key: "totalMarketCap",
        title: "总市值(亿)",
        width: 110,
        render: formatBillion
      },
      {
        key: "turnoverRate",
        title: "换手率(%)",
        width: 100,
        render: formatNumber
      },
      { key: "pe9", title: "市盈率", width: 90, render: formatNumber },
      { key: "roeWeight", title: "ROE(%)", width: 90, render: formatNumber },
      {
        key: "netprofitYoyRatio",
        title: "净利润增长(%)",
        width: 120,
        render: formatNumber
      }
    ]
  },
  {
    value: "price",
    label: "行情交易",
    columns: [
      { key: "code", title: "股票代码", width: 100 },
      { key: "name", title: "股票名称", width: 120 },
      { key: "newPrice", title: "最新价", width: 90, render: formatNumber },
      {
        key: "changeRate",
        title: "涨跌幅(%)",
        width: 100,
        render: formatNumber
      },
      { key: "amplitude", title: "振幅(%)", width: 90, render: formatNumber },
      {
        key: "turnoverRate",
        title: "换手率(%)",
        width: 100,
        render: formatNumber
      },
      { key: "volumeRatio", title: "量比", width: 80, render: formatNumber },
      { key: "dealAmount", title: "成交额", width: 120, render: formatNumber },
      {
        key: "changerate5days",
        title: "5日涨跌(%)",
        width: 110,
        render: formatNumber
      },
      {
        key: "changerate10days",
        title: "10日涨跌(%)",
        width: 110,
        render: formatNumber
      }
    ]
  },
  {
    value: "fundamental",
    label: "基本面",
    columns: [
      { key: "code", title: "股票代码", width: 100 },
      { key: "name", title: "股票名称", width: 120 },
      { key: "roeWeight", title: "ROE(%)", width: 90, render: formatNumber },
      {
        key: "netprofitYoyRatio",
        title: "净利润增长(%)",
        width: 120,
        render: formatNumber
      },
      {
        key: "toiYoyRatio",
        title: "营收增长(%)",
        width: 110,
        render: formatNumber
      },
      { key: "saleGpr", title: "毛利率(%)", width: 100, render: formatNumber },
      { key: "saleNpr", title: "净利率(%)", width: 100, render: formatNumber },
      {
        key: "debtAssetRatio",
        title: "资产负债率(%)",
        width: 120,
        render: formatNumber
      },
      {
        key: "currentRatio",
        title: "流动比率",
        width: 100,
        render: formatNumber
      }
    ]
  },
  {
    value: "valuation",
    label: "估值指标",
    columns: [
      { key: "code", title: "股票代码", width: 100 },
      { key: "name", title: "股票名称", width: 120 },
      { key: "pe9", title: "市盈率TTM", width: 110, render: formatNumber },
      {
        key: "pettmdeducted",
        title: "市盈率(扣非)",
        width: 120,
        render: formatNumber
      },
      { key: "pbnewmrq", title: "市净率", width: 90, render: formatNumber },
      { key: "ps9", title: "市销率", width: 90, render: formatNumber },
      { key: "pcfjyxjl9", title: "市现率", width: 90, render: formatNumber },
      { key: "zxgxl", title: "股息率(%)", width: 100, render: formatNumber },
      {
        key: "totalMarketCap",
        title: "总市值(亿)",
        width: 110,
        render: formatBillion
      }
    ]
  },
  {
    value: "growth",
    label: "成长能力",
    columns: [
      { key: "code", title: "股票代码", width: 100 },
      { key: "name", title: "股票名称", width: 120 },
      {
        key: "netprofitYoyRatio",
        title: "净利润同比(%)",
        width: 120,
        render: formatNumber
      },
      {
        key: "netprofitGrowthrate3y",
        title: "净利润3年复合(%)",
        width: 140,
        render: formatNumber
      },
      {
        key: "toiYoyRatio",
        title: "营收同比(%)",
        width: 110,
        render: formatNumber
      },
      {
        key: "incomeGrowthrate3y",
        title: "营收3年复合(%)",
        width: 130,
        render: formatNumber
      },
      {
        key: "basicepsYoyRatio",
        title: "EPS增长率(%)",
        width: 120,
        render: formatNumber
      },
      {
        key: "predictNetprofitRatio",
        title: "预测净利增长(%)",
        width: 130,
        render: formatNumber
      }
    ]
  },
  {
    value: "profitability",
    label: "盈利质量",
    columns: [
      { key: "code", title: "股票代码", width: 100 },
      { key: "name", title: "股票名称", width: 120 },
      { key: "roeWeight", title: "ROE(%)", width: 90, render: formatNumber },
      { key: "jroa", title: "ROA(%)", width: 90, render: formatNumber },
      { key: "roic", title: "ROIC(%)", width: 90, render: formatNumber },
      {
        key: "perNetcashOperate",
        title: "每股经营现金流",
        width: 130,
        render: formatNumber
      },
      {
        key: "perFcfe",
        title: "每股自由现金流",
        width: 130,
        render: formatNumber
      },
      { key: "basicEps", title: "每股收益", width: 100, render: formatNumber }
    ]
  },
  {
    value: "institution",
    label: "机构持股",
    columns: [
      { key: "code", title: "股票代码", width: 100 },
      { key: "name", title: "股票名称", width: 120 },
      {
        key: "allcorpRatio",
        title: "机构持股比例(%)",
        width: 130,
        render: formatNumber
      },
      {
        key: "allcorpFundRatio",
        title: "基金持股比例(%)",
        width: 130,
        render: formatNumber
      },
      {
        key: "allcorpSbRatio",
        title: "社保持股比例(%)",
        width: 130,
        render: formatNumber
      },
      {
        key: "allcorpQfiiRatio",
        title: "QFII持股比例(%)",
        width: 130,
        render: formatNumber
      },
      {
        key: "holdRatioCount",
        title: "十大股东比例(%)",
        width: 130,
        render: formatNumber
      },
      {
        key: "holderRatio",
        title: "户数增长率(%)",
        width: 120,
        render: formatNumber
      }
    ]
  },
  {
    value: "funds",
    label: "资金动向",
    columns: [
      { key: "code", title: "股票代码", width: 100 },
      { key: "name", title: "股票名称", width: 120 },
      {
        key: "netInflow",
        title: "当日净流入(万)",
        width: 130,
        render: value => formatNumber(value / 10000)
      },
      {
        key: "netinflow5days",
        title: "5日净流入(万)",
        width: 130,
        render: value => formatNumber(value / 10000)
      },
      { key: "ddx", title: "DDX", width: 80, render: formatNumber },
      { key: "ddx5d", title: "5日DDX", width: 90, render: formatNumber },
      {
        key: "nowinterstRatio",
        title: "当日增仓比(%)",
        width: 120,
        render: formatNumber
      },
      {
        key: "nowinterstRatio5d",
        title: "5日增仓比(%)",
        width: 120,
        render: formatNumber
      }
    ]
  }
];

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
      <Table stickyHeader verticalSpacing="xs">
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
  total
}: {
  columns: Column[];
  data: StockSelection[];
  loading: boolean;
  onLoadMore: () => void;
  total: number;
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
          <Table.Th style={{ width: 50 }}>序号</Table.Th>
          {columns.map(column => (
            <Table.Th key={column.key} style={{ width: column.width }}>
              {column.title}
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
    <Group mt="sm">
      <Text size="sm" c="dimmed">
        共 {total} 条数据
      </Text>
    </Group>
  </>
);

const StockList = () => {
  const { filters } = useStockContext();
  const [visible, { open, close }] = useDisclosure(false);
  const [stockList, setStockList] = useState<StockSelection[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const getStockList = async (currentPage: number) => {
    if (!hasMore || (currentPage > 1 && visible)) return;

    if (currentPage === 1) {
      open();
    }

    const response = await get("/api/stock/list", {
      ...filters,
      page: currentPage,
      pageSize: 20,
      industries: filters.industries?.join(","),
      concepts: filters.concepts?.join(",")
    });

    if (currentPage === 1) {
      close();
      setIsFirstLoading(false);
    }

    if (response.success) {
      const { data, pagination } = response;
      if (currentPage === 1) {
        setStockList(data);
        setTotal(pagination.total);
      } else {
        setStockList(prev => [...prev, ...data]);
      }
      setHasMore(currentPage < pagination.totalPage);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !visible) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setIsFirstLoading(true);
    getStockList(1);
  }, [filters]);

  useEffect(() => {
    if (page > 1) {
      getStockList(page);
    }
  }, [page]);

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
          <StockTable
            columns={tab.columns}
            data={stockList}
            loading={isFirstLoading}
            onLoadMore={handleLoadMore}
            total={total}
          />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};

export default StockList;
