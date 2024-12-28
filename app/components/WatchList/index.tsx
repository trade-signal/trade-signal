import { Button, Group, Stack, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import InstrumentSelectorModal from "@/app/components/modals/InstrumentSelectorModal";
import { WatchlistWithStocks } from "@/app/api/watchlist/list/route";
import { clientGet, clientPost } from "@/shared/request";
import { useState } from "react";
import { StockQuotesRealTime } from "@prisma/client";

const WatchList = () => {
  const [opened, { open, close }] = useDisclosure();
  const queryClient = useQueryClient();

  const [currentWatchlist, setCurrentWatchlist] =
    useState<WatchlistWithStocks>();

  const { data: watchList } = useQuery({
    queryKey: ["watchlist-list"],
    queryFn: (): Promise<WatchlistWithStocks[]> =>
      clientGet("/api/watchlist/list", {}),
    onSuccess: data => {
      setCurrentWatchlist(data[0]);
    }
  });

  const addMutation = useMutation({
    mutationFn: (value: StockQuotesRealTime) =>
      clientPost("/api/watchlist/add", {
        code: value.code,
        name: value.name,
        watchlistId: currentWatchlist?.id,
        type: "stock"
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist-list"] });
    }
  });

  const removeMutation = useMutation({
    mutationFn: (value: StockQuotesRealTime) =>
      clientPost("/api/watchlist/remove", {
        code: value.code,
        watchlistId: currentWatchlist?.id,
        type: "stock"
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist-list"] });
    }
  });

  return (
    <Stack>
      <Group p="xs" justify="space-between">
        <Text size="sm" fw={600}>
          自选列表
        </Text>
        <Button p="xs" size="xs" variant="subtle" onClick={open}>
          <IconPlus size={16} />
        </Button>
      </Group>

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
