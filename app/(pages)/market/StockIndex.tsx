"use client";

import { Paper, rem, Tabs, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { clientGet } from "@/shared/request";
import { useState } from "react";
import { StockIndexOrder } from "@/app/api/(stock)/stock-index/list/route";
import StockIndexChart from "./StockIndexChart";

const StockIndex = () => {
  const { data } = useQuery({
    queryKey: ["stock-index"],
    queryFn: () => clientGet("/api/stock-index/list", {})
  }) as { data: StockIndexOrder[] };

  const [activeTab, setActiveTab] = useState<string | null>("000001");

  return (
    <Paper>
      <Title order={2} size={rem(32)}>
        指数
      </Title>

      <Tabs
        mt="lg"
        variant="pills"
        defaultValue={activeTab}
        onChange={value => setActiveTab(value)}
      >
        <Tabs.List>
          {data?.map(item => (
            <Tabs.Tab value={item.code} key={item.code}>
              {item.name}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {data?.map(item => (
          <Tabs.Panel value={item.code} key={item.code} pt="lg">
            <StockIndexChart {...item} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </Paper>
  );
};

export default StockIndex;
