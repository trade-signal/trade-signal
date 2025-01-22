"use client";

import { FC, useMemo, useState } from "react";
import {
  Box,
  Group,
  Loader,
  Paper,
  rem,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip
} from "@mantine/core";

import { clientGet } from "@/shared/request";
import { useQuery } from "@tanstack/react-query";
import { getRefetchInterval } from "@/shared/env";
import {
  formatNumber,
  formatPercentPlain
} from "@/app/components/tables/DataTable/util";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable
} from "mantine-react-table";
import { StockQuotesOrder } from "@/app/api/(stock)/stock-quotes/list/route";
import { StockQuotesLatest } from "@prisma/client";
import { THEME_SETTING_KEY, ThemeSetting } from "@/app/hooks/useThemeSetting";
import { readLocalStorageValue } from "@mantine/hooks";

import styles from "./index.module.css";

interface StockRankingProps {
  title: string;
  indicator: string;
  order: "asc" | "desc";
  doubleColumn?: boolean;
}

const StockRanking: FC<StockRankingProps> = props => {
  const { title, indicator, order, doubleColumn = false } = props;

  const themeSetting: ThemeSetting = readLocalStorageValue({
    key: THEME_SETTING_KEY
  });

  const { data, isLoading } = useQuery({
    queryKey: ["stock-ranking", indicator, order],
    queryFn: (): Promise<StockQuotesLatest[]> =>
      clientGet("/api/stock-ranking", {
        orderBy: indicator,
        order: order
      }),
    refetchInterval: getRefetchInterval()
  });

  const columns = useMemo<MRT_ColumnDef<StockQuotesLatest>[]>(() => {
    const baseColumns = [
      {
        header: "代码",
        accessorKey: "stock",
        Cell: ({ row }) => (
          <Tooltip label="股票代码和名称" position="top-start">
            <Stack gap={0}>
              <Text>{row.original.name}</Text>
              <Text>{row.original.code}</Text>
            </Stack>
          </Tooltip>
        ),
        size: 160
      }
    ];

    const indicatorColumns = {
      volume: [
        {
          header: "成交量",
          accessorKey: "volume",
          size: 140,
          Cell: ({ row }) => (
            <Tooltip label="当日成交量/当日成交额" position="right">
              <Stack gap={0} ta="right">
                <Text>{formatNumber(row.original.volume / 10000, 2)}万</Text>
                <Text>
                  {formatNumber(row.original.dealAmount / 100000000, 2)}亿
                </Text>
              </Stack>
            </Tooltip>
          )
        }
      ],
      amplitude: [
        {
          header: "振幅",
          accessorKey: "amplitude",
          size: 140,
          Cell: ({ row }) => (
            <Tooltip label="当日振幅" position="right">
              <Stack gap={0} ta="right">
                <Text>{formatPercentPlain(row.original.amplitude)}</Text>
                <Group justify="flex-end">
                  <Text c={themeSetting.upColor}>
                    {formatNumber(row.original.highPrice, 2)}
                  </Text>
                  <Text c={themeSetting.downColor}>
                    {formatNumber(row.original.lowPrice, 2)}
                  </Text>
                </Group>
              </Stack>
            </Tooltip>
          )
        }
      ],
      changeRate: [
        {
          header: "最新价",
          accessorKey: "newPrice",
          size: 100,
          Cell: ({ row }) => (
            <Tooltip label="最新成交价" position="right">
              <Box ta="right">
                <Text
                  c={
                    row.original.newPrice > row.original.preClosePrice
                      ? themeSetting.upColor ?? "rgba(236, 64, 64, 1)"
                      : themeSetting.downColor ?? "rgba(46, 139, 87, 1)"
                  }
                >
                  {formatNumber(row.original.newPrice, 2)}
                </Text>
              </Box>
            </Tooltip>
          )
        },
        {
          header: "涨跌幅",
          accessorKey: "changeRate",
          size: 100,
          Cell: ({ row }) => (
            <Tooltip label="当日涨跌幅" position="right">
              <Text
                ta="right"
                c={
                  row.original.newPrice > row.original.preClosePrice
                    ? themeSetting.upColor ?? "rgba(236, 64, 64, 1)"
                    : themeSetting.downColor ?? "rgba(46, 139, 87, 1)"
                }
              >
                {formatPercentPlain(row.original.changeRate)}
              </Text>
            </Tooltip>
          )
        }
      ]
    };

    return [
      ...baseColumns,
      ...indicatorColumns[indicator as keyof typeof indicatorColumns]
    ];
  }, [themeSetting, indicator]);

  // 表格基础配置
  const baseTableProps = {
    mantinePaperProps: {
      mt: "md",
      shadow: "none",
      withBorder: false
    },
    mantineTableProps: {
      verticalSpacing: "xs",
      style: { tableLayout: "fixed" }
    },
    mantineTableBodyCellProps: {
      style: { gap: 0 }
    },
    enablePagination: false,
    enableTableHead: false,
    enableTopToolbar: false,
    enableColumnActions: false,
    enableSorting: false,
    enableBottomToolbar: false
  } as const;

  // 数据分割
  const splitData = useMemo(() => {
    if (!data) return { mainData: [], extraData: [] };
    const rowCount = doubleColumn ? 3 : 6;
    return {
      mainData: data.slice(0, rowCount),
      extraData: doubleColumn ? data.slice(rowCount, rowCount * 2) : []
    };
  }, [data, doubleColumn]);

  // 创建主表格
  const mainTable = useMantineReactTable({
    columns,
    data: splitData.mainData,
    ...baseTableProps
  });

  // 创建额外表格
  const extraTable = useMantineReactTable({
    columns,
    data: splitData.extraData,
    ...baseTableProps
  });

  // 加载状态骨架屏
  const renderSkeletons = () => (
    <Stack mt="md">
      {Array(doubleColumn ? 3 : 6)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} height={58} width="100%" radius="sm" />
        ))}
    </Stack>
  );

  // 表格内容
  const renderTables = () => (
    <Group gap="xl" grow align="flex-start" mt="md">
      <MantineReactTable table={mainTable} />
      {doubleColumn && <MantineReactTable table={extraTable} />}
    </Group>
  );

  return (
    <Paper className={styles.paper}>
      <Group align="center">
        <Title order={2} size={rem(28)}>
          {title}
        </Title>
        {isLoading && <Loader size="sm" values="bars" />}
      </Group>

      {isLoading ? renderSkeletons() : renderTables()}
    </Paper>
  );
};

export default StockRanking;
