"use client";

import {
  Paper,
  rem,
  Tabs,
  Title,
  Text,
  Stack,
  Group,
  Loader
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { clientGet } from "@/shared/request";
import { useState } from "react";
import { StockQuotesOrder } from "@/app/api/(stock)/stock-quotes/list/route";
import SymbolChart from "@/app/components/charts/SymbolChart";
import { StockQuotesRealTime } from "@prisma/client";
import { formatNumber } from "@/app/components/tables/DataTable/util";
import { formatPercent } from "@/app/components/tables/DataTable/util";

const transformSymbolChartData = (data: StockQuotesRealTime) => {
  return {
    date: data.date,
    open: data.openPrice,
    high: data.highPrice,
    low: data.lowPrice,
    close: data.newPrice,
    preClose: data.preClosePrice
  };
};

const StockQuotes = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["stock-quotes"],
    queryFn: (): Promise<StockQuotesOrder[]> =>
      clientGet("/api/stock-quotes/list", {}),
    onSuccess(data) {
      if (data) {
        setActiveTab(data[0].code);
      }
    }
  });

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
          股票
        </Title>

        {isLoading ? <Loader size="sm" values="bars" /> : null}
      </Group>

      <Tabs
        mt="lg"
        variant="pills"
        radius="lg"
        value={activeTab}
        onChange={value => setActiveTab(value)}
      >
        <Tabs.List>
          {data?.map(item => (
            <Tabs.Tab
              color="gray.1"
              style={{
                justifyContent: "space-between",
                color: "#333",
                padding: "10px 20px",
                marginRight: rem(60)
              }}
              value={item.code}
              key={item.code}
            >
              <Stack gap={0} miw={rem(160)}>
                <Text>{item.name}</Text>
                <Group m={0} gap="xs" justify="space-between">
                  <Text>{formatNumber(item.latest?.newPrice)}</Text>
                  <Text>{formatPercent(item.latest?.changeRate || 0)}</Text>
                </Group>
              </Stack>
            </Tabs.Tab>
          ))}
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

export default StockQuotes;
