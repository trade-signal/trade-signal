"use client";

import { FC, useMemo, useState } from "react";
import {
  Box,
  Button,
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
import { useIntersection } from "@mantine/hooks";

import { clientGet } from "@/shared/request";
import { useQuery } from "@tanstack/react-query";
import { getRefetchInterval } from "@/shared/env";
import { useRouter } from "next/navigation";
import {
  formatBillion,
  formatNumber,
  formatPercentPlain
} from "@/app/components/tables/DataTable/util";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable
} from "mantine-react-table";
import { IconChevronCompactRight } from "@tabler/icons-react";
import { StockPlateQuotes } from "@prisma/client";
import { THEME_SETTING_KEY, ThemeSetting } from "@/app/hooks/useThemeSetting";
import { readLocalStorageValue } from "@mantine/hooks";

import styles from "./index.module.css";

interface StockRankingProps {
  title: string;
  indicator: string;
  order: "asc" | "desc";
  doubleColumn?: boolean;
  showMore?: boolean;
  moreText?: string;
  moreLink?: string;
}

interface StockRankingColumnDef extends MRT_ColumnDef<StockPlateQuotes> {
  size?: number;
}

const StockRanking: FC<StockRankingProps> = props => {
  const {
    title,
    indicator,
    order,
    doubleColumn = false,
    showMore = false,
    moreText = "",
    moreLink = ""
  } = props;

  const router = useRouter();

  const themeSetting: ThemeSetting = readLocalStorageValue({
    key: THEME_SETTING_KEY
  });

  const [hasLoaded, setHasLoaded] = useState(false);
  const { ref: containerRef, entry } = useIntersection({
    threshold: 0.1
  });

  const { data, isLoading } = useQuery({
    queryKey: ["stock-plate-ranking", indicator, order],
    queryFn: (): Promise<StockPlateQuotes[]> =>
      clientGet("/api/stock-plate-ranking/list", {
        orderBy: indicator,
        order: order
      }),
    refetchInterval: getRefetchInterval(),
    enabled: hasLoaded || !!entry?.isIntersecting,
    onSuccess: () => {
      setHasLoaded(true);
    }
  });

  const columns = useMemo<StockRankingColumnDef[]>(() => {
    const baseColumns: StockRankingColumnDef[] = [
      {
        header: "代码",
        accessorKey: "stock",
        Cell: ({ row }) => (
          <Tooltip label="板块代码和名称" position="top-start">
            <Stack gap={0}>
              <Text>{row.original.name}</Text>
              <Text>{row.original.code}</Text>
            </Stack>
          </Tooltip>
        ),
        size: 160
      }
    ];

    const indicatorColumns: Record<string, StockRankingColumnDef[]> = {
      changeRate: [
        {
          header: "涨幅",
          accessorKey: "changeRate",
          size: 100,
          Cell: ({ row }) => (
            <Tooltip label="当日涨幅" position="right">
              <Box ta="right">
                <Text>{formatPercentPlain(row.original.changeRate)}</Text>
              </Box>
            </Tooltip>
          )
        },
        {
          header: "成交额",
          accessorKey: "dealAmount",
          size: 100,
          Cell: ({ row }) => (
            <Stack gap={0} ta="right">
              <Tooltip label="当日成交额" position="right">
                <Box ta="right">
                  <Text>{formatBillion(row.original.dealAmount)}亿</Text>
                </Box>
              </Tooltip>
              <Tooltip label="上涨/下跌家数" position="right">
                <Group justify="flex-end">
                  <Text>{row.original.upCount}</Text>
                  <Text>{row.original.downCount}</Text>
                </Group>
              </Tooltip>
            </Stack>
          )
        }
      ],
      dealAmount: [
        {
          header: "成交额",
          accessorKey: "dealAmount",
          size: 100,
          Cell: ({ row }) => (
            <Tooltip label="当日成交额" position="right">
              <Box ta="right">
                <Text>{formatBillion(row.original.dealAmount)}亿</Text>
              </Box>
            </Tooltip>
          )
        },
        {
          header: "涨幅",
          accessorKey: "changeRate",
          size: 100,
          Cell: ({ row }) => (
            <Tooltip label="当日涨幅" position="right">
              <Box ta="right">
                {formatPercentPlain(row.original.changeRate)}
              </Box>
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
    <Group gap="xl" grow align="flex-start">
      <MantineReactTable table={mainTable} />
      {doubleColumn && <MantineReactTable table={extraTable} />}
    </Group>
  );

  return (
    <Paper className={styles.paper} ref={!hasLoaded ? containerRef : null}>
      <Group align="center">
        <Title order={2} size={rem(28)}>
          {title}
        </Title>
        {isLoading && <Loader size="sm" values="bars" />}
      </Group>

      {isLoading ? renderSkeletons() : renderTables()}

      {showMore ? (
        <Group gap="xs" className={styles.more}>
          <Button
            variant="subtle"
            radius="xl"
            onClick={() => moreLink && router.push(moreLink)}
          >
            {moreText}

            <IconChevronCompactRight size={16} />
          </Button>
        </Group>
      ) : null}
    </Paper>
  );
};

export default StockRanking;
