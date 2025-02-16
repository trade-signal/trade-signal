"use client";

import { FC, useState } from "react";
import { Group, Skeleton, Stack, Tabs, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { QuoteListType } from "./page";
import { useQuery } from "@tanstack/react-query";
import { clientGet } from "@/shared/request";
import { getRefetchInterval } from "@/shared/env";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable
} from "mantine-react-table";

interface PageProps {
  type: QuoteListType;
}

const tabs = {
  index: "大盘指数",
  stock: "A股行情",
  plate: "行业板块"
};

const getApiPath = (type: QuoteListType) => {
  switch (type) {
    case "index":
      return "/api/stock-index/list";
    case "stock":
      return "/api/stock-quotes/list";
    case "plate":
      return "/api/stock-plate/list";
  }
};

const QuoteListClient: FC<PageProps> = ({ type }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(type);

  const handleTabChange = (val: QuoteListType) => {
    setActiveTab(val);
    router.push(`/quotes/${val}`);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["quotes", type],
    queryFn: () => {
      return clientGet(`${getApiPath(type)}`, {
        orderBy: "changeRate",
        order: "desc"
      });
    },
    refetchInterval: getRefetchInterval()
  });

  console.log(data);

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

      // 本地化配置
      localization: {
        search: "输入股票代码或名称",
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
      }

      // renderBottomToolbarCustomActions: () => (
      //   <Group w="100%" justify="flex-end" mt="sm">
      //     <Text size="sm" c="dimmed">
      //       共 {totalDBRowCount} 条记录 ({totalFetched}/{totalDBRowCount})
      //     </Text>
      //   </Group>
      // )
    } as const;

    const columns: MRT_ColumnDef<any>[] = [
      {
        header: "代码",
        accessorKey: "code"
      },
      {
        header: "名称",
        accessorKey: "name"
      }
    ];

    return (
      <MantineReactTable columns={columns} data={data} {...baseTableProps} />
    );
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
