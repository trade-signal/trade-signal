"use client";

import {
  FC,
  type UIEvent,
  useState,
  useMemo,
  useCallback,
  useRef
} from "react";
import dayjs from "dayjs";
import { Group, Skeleton, Stack, Tabs, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { QuoteListType } from "./page";
import { useInfiniteQuery } from "@tanstack/react-query";
import { get } from "@/shared/request";
import { getRefetchInterval } from "@/shared/env";
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_RowVirtualizer,
  MRT_SortingState
} from "mantine-react-table";
import {
  quotesIndexIndicatorMapping,
  quotesPlateIndicatorMapping,
  quotesIndicatorMapping
} from "@/cron/api/eastmoney.stock.indicator";
import { useSyncTaskContext } from "@/app/providers/SyncTaskProvider";

interface PageProps {
  type: QuoteListType;
  indicator?: string;
  order?: "asc" | "desc";
}

const tabs = {
  index: "大盘指数",
  plate: "行业板块",
  stock: "个股行情"
};

const getApiPath = (type: QuoteListType) => {
  switch (type) {
    case "index":
      return "/api/stock-index/list";
    case "plate":
      return "/api/stock-plate/list";
    case "stock":
      return "/api/stock-quotes/list";
  }
};

const getSearchText = (type: QuoteListType) => {
  switch (type) {
    case "index":
      return "输入指数代码或名称";
    case "plate":
      return "输入板块代码或名称";
    case "stock":
      return "输入股票代码或名称";
  }
};

const getTaskType = (type: QuoteListType) => {
  switch (type) {
    case "index":
      return "stock_index_quotes";
    case "plate":
      return "stock_plate_quotes";
    case "stock":
      return "stock_quotes";
  }
};
const getColumns = (type: QuoteListType) => {
  switch (type) {
    case "index":
      return Object.keys(quotesIndexIndicatorMapping).map(key => {
        const indicator =
          quotesIndexIndicatorMapping[
            key as keyof typeof quotesIndexIndicatorMapping
          ];
        return {
          header: indicator.cn,
          accessorKey: key,
          Cell: ({ cell }: { cell: any }) =>
            indicator.formatter(cell.getValue())
        };
      });
    case "plate":
      return Object.keys(quotesPlateIndicatorMapping).map(key => {
        const indicator =
          quotesPlateIndicatorMapping[
            key as keyof typeof quotesPlateIndicatorMapping
          ];
        return {
          header: indicator.cn,
          accessorKey: key,
          Cell: ({ cell }: { cell: any }) => {
            let value = cell.getValue();

            if (
              value &&
              (key === "newPrice" ||
                key === "changeRate" ||
                key === "upsDowns" ||
                key === "turnoverRate" ||
                key === "totalMarketCap")
            ) {
              value = value / 100;
            }

            return indicator.formatter(value);
          }
        };
      });
    case "stock":
      return Object.keys(quotesIndicatorMapping).map(key => {
        const indicator =
          quotesIndicatorMapping[key as keyof typeof quotesIndicatorMapping];
        return {
          header: indicator.cn,
          accessorKey: key,
          Cell: ({ cell }: { cell: any }) =>
            indicator.formatter(cell.getValue())
        };
      });
  }
};

const QuoteListClient: FC<PageProps> = ({ type, indicator, order }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(type);

  const { task } = useSyncTaskContext();

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<MRT_SortingState>(
    indicator ? [{ id: indicator, desc: order === "desc" }] : []
  );

  const refreshTime = useMemo(() => {
    const currentBatch = task.find(
      (item: any) => item.taskType === getTaskType(type)
    );
    return dayjs(currentBatch?.batchDate).format("YYYY-MM-DD HH:mm");
  }, [task]);

  const handleTabChange = (val: QuoteListType) => {
    setActiveTab(val);
    router.push(`/quotes/${val}`);
  };

  const {
    data: stocks,
    fetchNextPage,
    isFetching,
    isLoading,
    isError
  } = useInfiniteQuery({
    queryKey: ["quotes", type, columnFilters, globalFilter, sorting],
    queryFn: ({ pageParam = 0 }) => {
      return get(`${getApiPath(type)}`, {
        page: pageParam + 1,
        pageSize: 20,
        columnFilters: JSON.stringify(columnFilters ?? []),
        globalFilter: globalFilter ?? "",
        sorting: JSON.stringify(sorting ?? [])
      });
    },
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchInterval: getRefetchInterval(),
    refetchOnWindowFocus: false
  });

  const flatData = useMemo(
    () => stocks?.pages.flatMap(page => page.data) ?? [],
    [stocks]
  );

  const totalDBRowCount = stocks?.pages?.[0]?.pagination?.total ?? 0;
  const totalFetched = flatData.length;

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (
          scrollHeight - scrollTop - clientHeight < 20 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  const renderTabContent = (field: string) => {
    if (activeTab !== field) {
      return null;
    }

    if (isLoading) {
      return <Skeleton height="80vh" />;
    }

    const baseTableProps = {
      // 功能开关配置
      enableRowVirtualization: true,
      enableGlobalFilter: true, // 启用全局搜索
      positionGlobalFilter: "left",
      initialState: {
        showGlobalFilter: true // 默认显示搜索框
      },

      // 设置表格高度
      enableStickyHeader: true,

      // 禁用不需要的功能
      enablePagination: false,
      enableDensityToggle: false,
      enableFullScreenToggle: false,
      enableRowNumbers: false,
      enableFilters: true,
      enableColumnFilters: true,
      enableColumnActions: true,
      enableRowActions: false,

      // 数据处理相关
      manualFiltering: true,
      manualSorting: true,

      // 虚拟滚动相关
      mantineTableContainerProps: {
        ref: tableContainerRef,
        style: { maxHeight: "calc(100vh - 240px)" },
        onScroll: (event: UIEvent<HTMLDivElement>) =>
          fetchMoreOnBottomReached(event.target as HTMLDivElement)
      },
      rowVirtualizerInstanceRef,
      rowVirtualizerOptions: { overscan: 10 },

      // 表格样式配置
      mantinePaperProps: {
        style: {
          border: "none",
          padding: 0
        }
      },

      // 表格状态
      state: {
        columnFilters,
        globalFilter,
        isLoading,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        sorting
      },

      // 事件处理
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      onSortingChange: setSorting,

      // 本地化配置
      localization: {
        search: getSearchText(activeTab),
        showHideSearch: "显示/隐藏搜索框",
        filterByColumn: "筛选{column}",
        clearFilter: "清除筛选条件",
        showHideFilters: "显示/隐藏筛选器",
        clearSort: "取消排序",
        sortByColumnAsc: "{column}升序",
        sortByColumnDesc: "{column}降序",
        showHideColumns: "列显示设置",
        showAllColumns: "显示全部列",
        hideColumn: "隐藏{column}",
        showAll: "全部显示",
        hideAll: "全部隐藏",
        noResultsFound: "未找到相关记录",
        noRecordsToDisplay: "暂无数据"
      },

      // 自定义渲染
      mantineToolbarAlertBannerProps: {
        color: "red",
        children: "数据加载中..."
      },

      renderBottomToolbarCustomActions: () => (
        <Group w="100%" justify="space-between" mt="sm">
          <Text size="sm" c="dimmed">
            更新时间: {refreshTime}
          </Text>
          <Text size="sm" c="dimmed">
            共 {totalDBRowCount} 条记录 ({totalFetched}/{totalDBRowCount})
          </Text>
        </Group>
      )
    } as const;

    const columns: MRT_ColumnDef<any>[] = getColumns(activeTab);

    return (
      <MantineReactTable
        columns={columns}
        data={flatData}
        {...baseTableProps}
      />
    );
  };

  return (
    <Stack className="market-list-container" py="md">
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

        {Object.entries(tabs).map(([key]) => (
          <Tabs.Panel key={key} value={key} px="sm" py="lg">
            {renderTabContent(key)}
          </Tabs.Panel>
        ))}
      </Tabs>
    </Stack>
  );
};

export default QuoteListClient;
