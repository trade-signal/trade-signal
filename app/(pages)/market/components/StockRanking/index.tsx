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
  Title
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
import { StockQuotesLatest, StockQuotesLatest } from "@prisma/client";
import { THEME_SETTING_KEY, ThemeSetting } from "@/app/hooks/useThemeSetting";
import { readLocalStorageValue } from "@mantine/hooks";

import styles from "./index.module.css";

interface StockRankingProps {
  title: string;
  indicator: string;
  order: "asc" | "desc";
}

const StockRanking: FC<StockRankingProps> = props => {
  const { title, indicator, order } = props;

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
    return [
      {
        header: "代码",
        accessorKey: "stock",
        Cell: ({ row }) => (
          <Stack gap={0}>
            <Text>{row.original.name}</Text>
            <Text>{row.original.code}</Text>
          </Stack>
        ),
        size: 200
      },
      {
        header: "最新价",
        accessorKey: "newPrice",
        size: 100,
        Cell: ({ row }) => (
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
        )
      },
      {
        header: "涨跌幅",
        accessorKey: "changeRate",
        size: 100,
        Cell: ({ row }) => (
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
        )
      }
    ];
  }, [themeSetting]);

  const table = useMantineReactTable({
    columns,
    data: data || [],

    // 无数据文案
    renderEmptyRowsFallback: () => <Text>暂无数据</Text>,

    // 表格样式
    mantinePaperProps: {
      mt: "md",
      shadow: "none",
      withBorder: false
    },
    mantineTableProps: {
      verticalSpacing: "xs"
    },
    mantineTableBodyCellProps: {
      style: {
        gap: 0
      }
    },

    // 禁用不需要的功能
    enableTableHead: false,
    enableTopToolbar: false,
    enableColumnActions: false,
    enablePagination: false,
    enableSorting: false,
    enableBottomToolbar: false
  });

  return (
    <Paper className={styles.paper}>
      <Group align="center">
        <Title order={2} size={rem(28)}>
          {title}
        </Title>

        {isLoading ? <Loader size="sm" values="bars" /> : null}
      </Group>

      {isLoading ? (
        <Stack mt="md">
          <Skeleton height={58} width="100%" radius="sm" />
          <Skeleton height={58} width="100%" radius="sm" />
          <Skeleton height={58} width="100%" radius="sm" />
          <Skeleton height={58} width="100%" radius="sm" />
          <Skeleton height={58} width="100%" radius="sm" />
          <Skeleton height={58} width="100%" radius="sm" />
        </Stack>
      ) : (
        <MantineReactTable table={table} />
      )}
    </Paper>
  );
};

export default StockRanking;
