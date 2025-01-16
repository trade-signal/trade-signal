"use client";

import { FC, useMemo, useState } from "react";
import { Group, Loader, Paper, rem, Stack, Text, Title } from "@mantine/core";

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

import styles from "./index.module.css";

interface StockChangeRateProps {
  mode: "up" | "down";
}

const StockChangeRate: FC<StockChangeRateProps> = props => {
  const { mode } = props;

  const { data, isLoading } = useQuery({
    queryKey: ["stock-ranking", mode],
    queryFn: (): Promise<StockQuotesRealTime[]> =>
      clientGet("/api/stock-ranking", {
        orderBy: "changeRate",
        order: mode === "up" ? "desc" : "asc"
      }),
    refetchInterval: getRefetchInterval()
  });

  const columns = useMemo<MRT_ColumnDef<StockQuotesOrder>[]>(() => {
    return [
      {
        header: "代码",
        accessorKey: "stock",
        Cell: ({ row }) => (
          <Stack gap="xs">
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
            <Text>{formatNumber(row.original.newPrice, 2)}</Text>
          </Box>
        )
      },
      {
        header: "涨跌幅",
        accessorKey: "changeRate",
        size: 100,
        Cell: ({ row }) => (
          <Text ta="right">{formatPercentPlain(row.original.changeRate)}</Text>
        )
      }
    ];
  }, []);

  const table = useMantineReactTable({
    columns,
    data: data || [],

    // 无数据文案
    renderEmptyRowsFallback: () => <Text>暂无数据</Text>,

    // 表格样式
    mantinePaperProps: {
      mt: "xs",
      shadow: "none",
      withBorder: false
    },
    mantineTableProps: {
      verticalSpacing: "xs",
      fontSize: "xs"
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
        <Title order={2} size={rem(32)}>
          {mode === "up" ? "股票涨幅榜" : "股票跌幅榜"}
        </Title>

        {isLoading ? <Loader size="sm" values="bars" /> : null}
      </Group>

      <MantineReactTable table={table} />
    </Paper>
  );
};

export default StockChangeRate;
