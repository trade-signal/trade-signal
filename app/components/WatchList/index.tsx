import {
  Box,
  Button,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useQuery, useMutation } from "@tanstack/react-query";
import InstrumentSelectorModal from "@/app/components/modals/InstrumentSelectorModal";
import { WatchlistWithStocks } from "@/app/api/watchlist/list/route";
import { useLoginContext } from "@/app/providers/LoginProvider";
import { clientGet, post } from "@/shared/request";
import { useState, useEffect } from "react";
import { StockQuotesRealTime } from "@prisma/client";
import WatchListItem from "./WatchListItem";

const WatchList = () => {
  const { userInfo } = useLoginContext();
  const [opened, { open, close }] = useDisclosure();

  const [currentWatchlist, setCurrentWatchlist] =
    useState<WatchlistWithStocks>();

  const { isLoading, refetch } = useQuery({
    queryKey: ["watchlist-list"],
    queryFn: (): Promise<WatchlistWithStocks[]> =>
      clientGet("/api/watchlist/list", {}),
    onSuccess: data => {
      setCurrentWatchlist(data[0]);
    },
    enabled: !!userInfo
  });

  useEffect(() => {
    if (!userInfo) return;
    refetch();
  }, [userInfo]);

  const addMutation = useMutation({
    mutationFn: (value: StockQuotesRealTime) =>
      post("/api/watchlist/add", {
        code: value.code,
        name: value.name,
        watchlistId: currentWatchlist?.id,
        type: "stock"
      }),
    onSuccess: () => {
      console.log("addMutation onSuccess");
      refetch();
    }
  });

  const removeMutation = useMutation({
    mutationFn: (value: StockQuotesRealTime) =>
      post("/api/watchlist/remove", {
        code: value.code,
        watchlistId: currentWatchlist?.id,
        type: "stock"
      }),
    onSuccess: () => {
      console.log("removeMutation onSuccess");
      refetch();
    }
  });

  if (!userInfo) {
    return null;
  }

  if (isLoading && !currentWatchlist) {
    return (
      <Stack h={"50vh"} justify="center" align="center">
        <Loader size="xs" />
      </Stack>
    );
  }

  return (
    <Stack gap={0} h={"50vh"} style={{ background: "white" }}>
      <Group h={59} p="xs" justify="space-between">
        <Text size="sm" fw={600}>
          {currentWatchlist?.name || "自选表"}
        </Text>
        <Button p="xs" size="xs" variant="subtle" onClick={open}>
          <IconPlus size={16} />
        </Button>
      </Group>

      <ScrollArea h={"50vh"} py="xs" style={{ borderTop: "1px solid #e0e0e0" }}>
        {currentWatchlist?.stocks.map(stock => (
          <Box key={stock.code} mb={2}>
            <WatchListItem stock={stock} onRemove={removeMutation.mutate} />
          </Box>
        ))}
        {currentWatchlist?.stocks.length === 0 && (
          <Text size="sm" c="dimmed">
            暂无自选股票
          </Text>
        )}
      </ScrollArea>

      <InstrumentSelectorModal
        open={opened}
        watchlist={currentWatchlist}
        onAdd={addMutation.mutate}
        onDelete={removeMutation.mutate}
        onClose={close}
      />
    </Stack>
  );
};

export default WatchList;
