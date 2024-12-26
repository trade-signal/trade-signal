import { useEffect, useState } from "react";
import { Button, Group, Stack, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { StockQuotesRealTime } from "@prisma/client";
import { get } from "@/shared/request";
import InstrumentSelectorModal from "@/app/components/modals/InstrumentSelectorModal";
import { WatchlistWithStocks } from "@/app/api/watchlist/list/route";

const WatchList = () => {
  const [opened, { open, close }] = useDisclosure();

  const [filter, setFilter] = useState<{
    industries: string[];
  }>({ industries: [] });
  const [stocks, setStocks] = useState<StockQuotesRealTime[]>([]);

  const [watchList, setWatchList] = useState<WatchlistWithStocks[]>([]);

  const getFilter = async () => {
    const response = await get("/api/stock-quotes/filter");
    if (response.success) {
      setFilter(response.data);
    }
  };

  const getStocks = async () => {
    try {
      const response = await get("/api/stock-quotes/list");

      if (response.success) {
        setStocks(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getWatchList = async () => {
    const response = await get("/api/watchlist/list");
    if (response.success) {
      setWatchList(response.data);
    }
  };

  useEffect(() => {
    getWatchList();
    getFilter();
    getStocks();
  }, []);

  return (
    <Stack>
      <Group p="xs" justify="space-between">
        <Text size="sm" fw={600}>
          自选表
        </Text>
        <Button p="xs" size="xs" variant="subtle" onClick={open}>
          <IconPlus size={16} />
        </Button>
      </Group>

      <InstrumentSelectorModal
        filter={filter}
        stocks={stocks}
        open={opened}
        onClose={close}
      />
    </Stack>
  );
};

export default WatchList;
