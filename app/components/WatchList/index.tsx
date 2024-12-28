import { Button, Group, Stack, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import InstrumentSelectorModal from "@/app/components/modals/InstrumentSelectorModal";
import { WatchlistWithStocks } from "@/app/api/watchlist/list/route";
import { clientGet } from "@/shared/request";

const WatchList = () => {
  const [opened, { open, close }] = useDisclosure();

  const { data: watchList } = useQuery({
    queryKey: ["watchlist-list"],
    queryFn: (): Promise<WatchlistWithStocks[]> =>
      clientGet("/api/watchlist/list", {})
  });

  const handleAdd = (value: string) => {
    console.log(value);
  };

  const handleDelete = (value: string) => {
    console.log(value);
  };

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
        watchlist={watchList}
        onAdd={handleAdd}
        onDelete={handleDelete}
        onClose={close}
      />
    </Stack>
  );
};

export default WatchList;
