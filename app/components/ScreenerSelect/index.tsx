import { useEffect, useState, type FC } from "react";
import {
  Pill,
  Combobox,
  CheckIcon,
  Group,
  useCombobox,
  Text,
  ScrollArea,
  Button,
  Box,
  Divider
} from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconX } from "@tabler/icons-react";

interface StockScreenerSelectProps {
  title: string;
  data: { label: string; value: string; desc: string }[];
  value?: string | null;
  clearable?: boolean;
  nothingFoundMessage?: string;
  onChange: (value: string | null) => void;
}

const StockScreenerSelect: FC<StockScreenerSelectProps> = props => {
  const { title, data, value, clearable, nothingFoundMessage, onChange } =
    props;

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active")
  });

  const [currentValue, setCurrentValue] = useState<string | null>(
    value || null
  );

  useEffect(() => {
    setCurrentValue(value || null);
  }, [value]);

  const handleValueSelect = (val: string) => {
    setCurrentValue(val);
    onChange(val);
  };

  const handleClear = () => {
    setCurrentValue(null);
    onChange(null);
  };

  const options = data.map(item => (
    <Combobox.Option
      value={item.value}
      key={item.value}
      active={currentValue === item.value}
    >
      <Group gap="sm">
        <Box>
          <Text size="sm">{item.label}</Text>
          <Text size="xs" c="gray">
            {item.desc}
          </Text>
        </Box>
        {currentValue === item.value ? <CheckIcon size={12} /> : null}
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      width={250}
      store={combobox}
      position="bottom-start"
      withArrow
      onOptionSubmit={handleValueSelect}
    >
      <Combobox.Target withAriaAttributes={false}>
        <Button
          variant="outline"
          w={"auto"}
          onClick={() => combobox.toggleDropdown()}
        >
          {title}{" "}
          <Box mt={2} ml={8}>
            {value}
          </Box>
          <Box ml={6}>
            {combobox.dropdownOpened ? (
              <IconChevronUp size={14} />
            ) : (
              <IconChevronDown size={14} />
            )}
          </Box>
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown styles={{ dropdown: { zIndex: 1000 } }}>
        {clearable && currentValue && (
          <Group
            gap={5}
            p="5px 10px"
            onClick={handleClear}
            style={{ cursor: "pointer" }}
          >
            <IconX size={18} /> <Text size="sm">清空已选</Text>
          </Group>
        )}

        {currentValue && <Divider mb={10} />}

        <Combobox.Options>
          <ScrollArea.Autosize type="scroll" mah={200}>
            {options.length > 0 ? (
              options
            ) : (
              <Combobox.Empty>
                <Text size="xs" c="gray">
                  {nothingFoundMessage || "未找到相关数据"}
                </Text>
              </Combobox.Empty>
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default StockScreenerSelect;
