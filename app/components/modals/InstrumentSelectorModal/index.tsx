import { isError, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  type UIEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { clientGet, get } from "@/shared/request";
import {
  ActionIcon,
  Flex,
  Group,
  Modal,
  rem,
  Stack,
  Text,
  TextInput,
  Tooltip
} from "@mantine/core";
import { StockQuotesRealTime } from "@prisma/client";
import { IconEdit, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_SortingState,
  type MRT_RowVirtualizer
} from "mantine-react-table";
import { WatchlistWithStocks } from "@/app/api/watchlist/list/route";

interface InstrumentSelectorModalProps {
  open: boolean;
  watchlist?: WatchlistWithStocks[];
  onAdd: (value: string) => void;
  onDelete: (value: string) => void;
  onClose: () => void;
}

const InstrumentSelectorModal = ({
  open,
  watchlist,
  onAdd,
  onDelete,
  onClose
}: InstrumentSelectorModalProps) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  console.log(columnFilters);
  console.log(globalFilter);
  console.log(sorting);

  const columns: MRT_ColumnDef<StockQuotesRealTime>[] = [
    {
      accessorKey: "code",
      header: "代码"
    },
    {
      accessorKey: "name",
      header: "名称"
    },
    {
      accessorKey: "industry",
      header: "行业"
    }
  ];

  const { data: filter } = useQuery({
    queryKey: ["stock-quotes-filter"],
    queryFn: () => clientGet("/api/stock-quotes/filter", {})
  });

  const {
    data: stocks,
    fetchNextPage,
    isFetching,
    isLoading,
    isError
  } = useInfiniteQuery({
    queryKey: ["stock-quotes-list", columnFilters, globalFilter, sorting],
    queryFn: () =>
      get("/api/stock-quotes/list", {
        columnFilters,
        globalFilter,
        sorting
      }),
    getNextPageParam: (_lastGroup, groups) => groups.length,
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
          console.log("fetch more");

          // fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  useEffect(() => {
    if (rowVirtualizerInstanceRef.current) {
      try {
        rowVirtualizerInstanceRef.current.scrollToIndex(0);
      } catch (e) {
        console.error(e);
      }
    }
  }, [sorting, columnFilters, globalFilter]);

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const handleClose = () => {
    onClose();
  };

  const table = useMantineReactTable<StockQuotesRealTime>({
    // 基础配置
    columns,
    data: flatData,

    // 功能开关配置
    enableRowVirtualization: true,
    enableRowActions: true,
    enableGlobalFilter: true, // 启用全局搜索
    initialState: {
      showGlobalFilter: true // 默认显示搜索框
    },

    // 禁用不需要的功能
    enablePagination: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableRowNumbers: false,
    enableFilters: false,
    enableColumnFilters: false,
    enableColumnActions: false,

    // 数据处理相关
    manualFiltering: true,
    manualSorting: true,

    // 虚拟滚动相关
    mantineTableContainerProps: {
      ref: tableContainerRef,
      style: { maxHeight: "400px" },
      onScroll: (event: UIEvent<HTMLDivElement>) =>
        fetchMoreOnBottomReached(event.target as HTMLDivElement)
    },
    rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 10 },

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

    // 样式和布局
    positionActionsColumn: "last",
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "操作"
      }
    },

    // 本地化配置
    localization: {
      search: "搜索内容",
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
      noRecordsToDisplay: "暂无数据"
    },

    // 自定义渲染
    mantineToolbarAlertBannerProps: {
      color: "red",
      children: "数据加载中..."
    },
    renderTopToolbarCustomActions: ({ table }) => <Group></Group>,
    renderRowActions: ({ row }) => (
      <Flex gap="md">
        <Tooltip label="">
          <ActionIcon onClick={() => onAdd(row.original.code)}>
            <IconPlus size={rem(16)} />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderBottomToolbarCustomActions: () => (
      <Group w="100%" justify="flex-end" mt="sm">
        <Text size="sm" c="dimmed">
          共 {totalDBRowCount} 条记录 ({totalFetched}/{totalDBRowCount})
        </Text>
      </Group>
    )
  });

  return (
    <Modal
      opened={open}
      onClose={handleClose}
      padding={0}
      closeButtonProps={{
        mr: "md"
      }}
      title={
        <Text size="lg" pl="md">
          添加到 “{watchlist?.[0]?.name}”
        </Text>
      }
      centered
      size="xl"
      closeOnClickOutside={false}
    >
      <MantineReactTable table={table} />
    </Modal>
  );
};

export default InstrumentSelectorModal;
