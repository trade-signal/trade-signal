"use client";

import { FC, useMemo, useState } from "react";
import { Group, Loader, Paper, rem, Title } from "@mantine/core";

import styles from "./index.module.css";
import { clientGet } from "@/shared/request";
import { useQuery } from "@tanstack/react-query";
import { transformSymbolChartData } from "@/shared/chart";
import { getRefetchInterval } from "@/shared/env";
import { StockQuotesOrder } from "@/app/api/(stock)/stock-quotes/list/route";
import { SymbolChartData } from "@/app/types/chart.type";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable
} from "mantine-react-table";

interface StockChangeRateProps {
  mode: "up" | "down";
}

const StockChangeRate: FC<StockChangeRateProps> = props => {
  const { mode } = props;

  const { data, isLoading } = useQuery({
    queryKey: ["stock-quotes", mode],
    queryFn: (): Promise<StockQuotesOrder[]> =>
      clientGet("/api/stock-quotes/list", {
        orderBy: "changeRate",
        order: mode === "up" ? "desc" : "asc"
      }),
    refetchInterval: getRefetchInterval(),
    onSuccess: data => {
      // setSymbolChartData(
      //   data?.map(item => ({
      //     code: item.code,
      //     name: item.name,
      //     latest: transformSymbolChartData(item.latest),
      //     trends: item.trends.map(trend => transformSymbolChartData(trend))
      //   }))
      // );
    }
  });

  const columns = useMemo<MRT_ColumnDef<StockQuotesOrder>[]>(() => {
    return [
      { header: "代码", accessorKey: "code" },
      { header: "名称", accessorKey: "name" },
      { header: "最新价", accessorKey: "latest.newPrice" },
      { header: "涨跌幅", accessorKey: "latest.changeRate" }
    ];
  }, []);

  const table = useMantineReactTable({
    columns,
    data: data || [],

    // 隐藏边框
    mantineTableContainerProps: {},

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
