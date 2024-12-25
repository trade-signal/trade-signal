import { Modal } from "@mantine/core";

interface InstrumentSelectorModalProps {
  open: boolean;
  onClose: () => void;
}

const InstrumentSelectorModal = ({
  open,
  onClose
}: InstrumentSelectorModalProps) => {
  return <Modal opened={open} onClose={onClose} title="选择股票"></Modal>;
};

export default InstrumentSelectorModal;
