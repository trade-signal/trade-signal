import { Modal, rem, ScrollArea, Stack, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

interface InstrumentSelectorModalProps {
  open: boolean;
  filter: { industries: string[] };
  stocks: StockQuotesRealTime[];
  onSearch: (value: string) => void;
  onSelect: (value: string) => void;
  onClose: () => void;
}

const InstrumentSelectorModal = ({
  open,
  filter,
  stocks,

  onClose
}: InstrumentSelectorModalProps) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      opened={open}
      onClose={handleClose}
      title="添加自选"
      size="md"
      centered
      size="lg"
      padding="md"
      closeOnClickOutside={false}
    >
      <Stack>
        <TextInput
          leftSection={
            <IconSearch style={{ width: rem(20), height: rem(20) }} />
          }
          placeholder="搜索..."
        />
      </Stack>
    </Modal>
  );
};

export default InstrumentSelectorModal;
