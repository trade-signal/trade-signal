"use client";

import dayjs from "dayjs";
import {
  Paper,
  rem,
  Tabs,
  Title,
  Text,
  Stack,
  Group,
  Loader,
  FloatingIndicator
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { clientGet } from "@/shared/request";
import { useEffect, useState } from "react";
import { StockIndexOrder } from "@/app/api/(stock)/stock-index/list/route";
import SymbolChart from "@/app/components/charts/SymbolChart";
import {
  formatNumber,
  formatPercent
} from "@/app/components/tables/DataTable/util";
import { StockIndexRealTime } from "@prisma/client";

import classes from "./StockIndex.module.css";

const transformSymbolChartData = (data: StockIndexRealTime) => {
  return {
    date: dayjs(Number(data.ts)).format("YYYY-MM-DD HH:mm:ss"),
    open: data.openPrice,
    high: data.highPrice,
    low: data.lowPrice,
    close: data.newPrice,
    preClose: data.preClosePrice
  };
};

const StockIndex = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["stock-index"],
    queryFn: (): Promise<StockIndexOrder[]> =>
      clientGet("/api/stock-index/list", {})
  });

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };

  useEffect(() => {
    if (data) {
      setActiveTab(data[0].code);
    }
  }, [data]);

  const symbolChartData = data?.map(item => ({
    code: item.code,
    name: item.name,
    latest: transformSymbolChartData(item.latest),
    trends: item.trends.map(trend => transformSymbolChartData(trend))
  }));

  return (
    <Paper>
      <Group align="center">
        <Title order={2} size={rem(32)}>
          指数
        </Title>

        {isLoading ? <Loader size="sm" values="bars" /> : null}
      </Group>

      <Tabs
        mt="lg"
        variant="none"
        radius="md"
        value={activeTab}
        onChange={value => setActiveTab(value)}
      >
        <Tabs.List ref={setRootRef} className={classes.list}>
          {data?.map(item => (
            <Tabs.Tab
              value={item.code}
              key={item.code}
              ref={setControlRef(item.code)}
              className={classes.tab}
            >
              <Stack gap={0} miw={rem(160)}>
                <Text className={classes.tabName}>{item.name}</Text>
                <Group m={0} gap="xs" justify="space-between">
                  <Text>{formatNumber(item.latest?.newPrice)}</Text>
                  <Text>{formatPercent(item.latest?.changeRate || 0)}</Text>
                </Group>
              </Stack>
            </Tabs.Tab>
          ))}

          <FloatingIndicator
            target={activeTab ? controlsRefs[activeTab] : null}
            parent={rootRef}
            className={classes.indicator}
          />
        </Tabs.List>

        {symbolChartData?.map(item => (
          <Tabs.Panel value={item.code} key={item.code} pt="lg">
            {item.code === activeTab ? <SymbolChart {...item} /> : null}
          </Tabs.Panel>
        ))}
      </Tabs>
    </Paper>
  );
};

export default StockIndex;
