import { Button, Group, Stack, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useWatchList } from "@/app/hooks/useWatchList";
import InstrumentSelectorModal from "@/app/components/modals/InstrumentSelectorModal";
import { useDisclosure } from "@mantine/hooks";

const WatchList = () => {
  const [opened, { open, close }] = useDisclosure();

  useWatchList();

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

      <InstrumentSelectorModal open={opened} onClose={close} />
    </Stack>
  );
};

export default WatchList;
