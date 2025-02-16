"use client";

import { FC, useState } from "react";
import { Stack, Tabs } from "@mantine/core";
import { useRouter } from "next/navigation";
import { QuoteListType } from "./page";

interface PageProps {
  type: QuoteListType;
}

const tabs = {
  indices: "大盘指数",
  stocks: "A股行情",
  sectors: "行业板块"
};

const QuoteListClient: FC<PageProps> = ({ type }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(type);

  const handleTabChange = (val: QuoteListType) => {
    setActiveTab(val);
    router.push(`/quotes/${val}`);
  };

  return (
    <Stack className="market-list-container" p="md">
      <Tabs
        value={activeTab}
        onChange={val => handleTabChange(val as QuoteListType)}
        variant="pills"
      >
        <Tabs.List px="md">
          {Object.entries(tabs).map(([key, label]) => (
            <Tabs.Tab key={key} value={key}>
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel value="indices" p="sm">
          指数行情
          {/* <StockList type={type} /> */}
        </Tabs.Panel>

        <Tabs.Panel value="stocks" p="sm">
          A股行情
          {/* <StockList type={type} /> */}
        </Tabs.Panel>

        <Tabs.Panel value="sectors" p="sm">
          行业板块
          {/* <IndustryList type={type} /> */}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default QuoteListClient;
