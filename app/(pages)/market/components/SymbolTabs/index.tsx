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
import { useEffect, useState } from "react";
import { getRefetchInterval } from "@/shared/env";
import { clientGet } from "@/shared/request";
import { IconChevronCompactRight } from "@tabler/icons-react";
import SymbolChart from "@/app/components/charts/SymbolChart";
import { StockQuotesOrder } from "@/app/api/(stock)/stock-quotes/list/route";
import {
  formatNumber,
  formatPercent
} from "@/app/components/tables/DataTable/util";
import { SymbolChartData } from "@/app/types/chart.type";
import { transformSymbolChartData } from "@/shared/chart";

import styles from "./index.module.css";

interface SymbolTabsProps {
  title: string;
  queryKey: string;
  apiPath: string;
  showMore?: boolean;
  moreText?: string;
  moreLink?: string;
}

const SymbolTabs: FC<SymbolTabsProps> = props => {
  const {
    title,
    queryKey,
    apiPath,
    showMore = false,
    moreText = "",
    moreLink = ""
  } = props;

  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string | null>(null);

  const [symbolChartData, setSymbolChartData] = useState<SymbolChartData[]>([]);

  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };

  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: (): Promise<StockQuotesOrder[]> => clientGet(apiPath, {}),
    refetchInterval: getRefetchInterval(),
    onSuccess: data => {
      setSymbolChartData(
        data?.map(item => ({
          code: item.code,
          name: item.name,
          latest: transformSymbolChartData(item.latest),
          trends: item.trends.map(trend => transformSymbolChartData(trend))
        }))
      );
    }
  });

  useEffect(() => {
    if (data && !activeTab) {
      setActiveTab(data[0].code);
    }
  }, [data]);

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
          {isLoading ? (
            <>
              <Skeleton height={64} width="20%" radius="sm" />
              <Skeleton height={64} width="20%" radius="sm" />
              <Skeleton height={64} width="20%" radius="sm" />
              <Skeleton height={64} width="20%" radius="sm" />
            </>
          ) : (
            data?.map(item => (
              <Tabs.Tab
                value={item.code}
                key={item.code}
                ref={setControlRef(item.code)}
                className={styles.tab}
              >
                <Stack gap={0} miw={rem(160)}>
                  <Text className={styles.tabName}>{item.name}</Text>
                  <Group m={0} gap="xs" justify="space-between">
                    <Text>{formatNumber(item.latest?.newPrice)}</Text>
                    <Text>{formatPercent(item.latest?.changeRate || 0)}</Text>
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
        ) : (
          symbolChartData?.map(item => (
            <Tabs.Panel value={item.code} key={item.code} pt="lg">
              {item.code === activeTab ? <SymbolChart {...item} /> : null}
            </Tabs.Panel>
          ))
        )}
      </Tabs>
    </Paper>
  );
};

export default SymbolTabs;
