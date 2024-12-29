import { Button, Group, ScrollArea, Stack, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useQuery, useMutation } from "@tanstack/react-query";
import InstrumentSelectorModal from "@/app/components/modals/InstrumentSelectorModal";
import { WatchlistWithStocks } from "@/app/api/watchlist/list/route";
import { clientGet, post } from "@/shared/request";
import { useState } from "react";
import { StockQuotesRealTime } from "@prisma/client";
import WatchListItem from "./WatchListItem";

const WatchList = () => {
  const [opened, { open, close }] = useDisclosure();

  const [currentWatchlist, setCurrentWatchlist] =
    useState<WatchlistWithStocks>();

  const { data: watchList, refetch } = useQuery({
    queryKey: ["watchlist-list"],
    queryFn: (): Promise<WatchlistWithStocks[]> =>
      clientGet("/api/watchlist/list", {}),
    onSuccess: data => {
      setCurrentWatchlist(data[0]);
    }
  });

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

  return (
    <Stack gap={0} style={{ background: "white" }}>
      <Group h={56} p="xs" justify="space-between">
        <Text size="sm" fw={600}>
          {currentWatchlist?.name || "自选表"}
        </Text>
        <Button p="xs" size="xs" variant="subtle" onClick={open}>
          <IconPlus size={16} />
        </Button>
      </Group>

      <ScrollArea
        h={"50vh"}
        p="xs"
        offsetScrollbars
        style={{ borderTop: "1px solid #e0e0e0", overflow: "hidden" }}
      >
        {currentWatchlist?.stocks.map(stock => (
          <WatchListItem stock={stock} onRemove={removeMutation.mutate} />
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
