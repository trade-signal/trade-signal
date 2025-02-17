"use client";

import { FC } from "react";
import {
  Paper,
  rem,
  Tabs,
  Title,
  Text,
  Stack,
  Group,
  Loader,
  FloatingIndicator,
  Skeleton,
  Button,
  Box
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getRefetchInterval } from "@/shared/env";
import { clientGet } from "@/shared/request";
import { IconChevronCompactRight } from "@tabler/icons-react";
import SymbolChart from "@/app/components/charts/SymbolChart";
import { StockQuotesItem } from "@/app/api/(stock)/stock-quotes/list/route";
import { StockIndexQuotesItem } from "@/app/api/(stock)/stock-index/list/route";
import { StockIndexTrends } from "@/app/api/(stock)/stock-index/trends/route";
import {
  formatNumber,
  formatPercent
} from "@/app/components/tables/DataTable/util";
import { SymbolChartData } from "@/app/types/chart.type";
import {
  transformSymbolChartTrends,
  transformSymbolChartKline
} from "@/shared/chart";

import styles from "./index.module.css";

interface SymbolTabsProps {
  title: string;
  queryKey: string;
  apiBasePath: string;
  showMore?: boolean;
  moreText?: string;
  moreLink?: string;
}

type SymbolTabsData = StockQuotesItem | StockIndexQuotesItem;

const SymbolTabs: FC<SymbolTabsProps> = props => {
  const {
    title,
    queryKey,
    apiBasePath,
    showMore = false,
    moreText = "",
    moreLink = ""
  } = props;

  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string | null>(null);

  const [symbolChartData, setSymbolChartData] = useState<SymbolChartData>();

  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };

  const { data: listData, isLoading: isListLoading } = useQuery({
    queryKey: [`${queryKey}_list`],
    queryFn: (): Promise<SymbolTabsData[]> =>
      clientGet(`${apiBasePath}/list`, {
        page: 1,
        pageSize: 5
      }),
    onSuccess: data => {
      if (data && !activeTab) {
        setActiveTab(data[0].code);
      }
    }
  });

  const { isLoading: isTrendsLoading } = useQuery({
    queryKey: [`${queryKey}_trends`, activeTab],
    queryFn: (): Promise<StockIndexTrends> =>
      activeTab
        ? clientGet(`${apiBasePath}/trends`, { code: activeTab })
        : Promise.resolve([]),
    refetchInterval: getRefetchInterval(),
    enabled: !!activeTab,
    onSuccess: data => {
      if (data?.trends) {
        const { code, name, trends } = data;

        const stock = listData?.find(item => item.code === code)?.stock;

        if (!stock) return;

        setSymbolChartData({
          code,
          name,
          stock: transformSymbolChartTrends(stock),
          trends: trends.map(trend => transformSymbolChartKline(trend))
        });
      }
    }
  });

  const isLoading = isListLoading || isTrendsLoading;

  return (
    <Paper>
      <Group align="center">
        <Title order={2} size={rem(32)}>
          {title}
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
        <Tabs.List ref={setRootRef} className={styles.list}>
          {isListLoading ? (
            <>
              <Skeleton height={64} width="20%" radius="sm" />
              <Skeleton height={64} width="20%" radius="sm" />
              <Skeleton height={64} width="20%" radius="sm" />
              <Skeleton height={64} width="20%" radius="sm" />
            </>
          ) : (
            listData?.map(item => (
              <Tabs.Tab
                value={item.code}
                key={item.code}
                ref={setControlRef(item.code)}
                className={styles.tab}
              >
                <Stack gap={0} miw={rem(160)}>
                  <Text className={styles.tabName}>{item.name}</Text>
                  <Group m={0} gap="xs" justify="space-between">
                    <Text>{formatNumber(item.stock.newPrice)}</Text>
                    <Text>{formatPercent(item.stock.changeRate || 0)}</Text>
                  </Group>
                </Stack>
              </Tabs.Tab>
            ))
          )}

          {showMore && !isLoading ? (
            <Box
              className={styles.more}
              onClick={() => moreLink && router.push(moreLink)}
            >
              <Button variant="filled" radius="xl">
                {moreText}

                <IconChevronCompactRight size={16} />
              </Button>
            </Box>
          ) : null}

          <FloatingIndicator
            target={activeTab ? controlsRefs[activeTab] : null}
            parent={rootRef}
            className={styles.indicator}
          />
        </Tabs.List>

        {isLoading ? (
          <Skeleton height={300} mt="lg" />
        ) : symbolChartData ? (
          <Box mt="lg">
            <SymbolChart {...symbolChartData} />
          </Box>
        ) : null}
      </Tabs>
    </Paper>
  );
};

export default SymbolTabs;
