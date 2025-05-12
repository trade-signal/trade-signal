import { useEffect, useState, type FC } from "react";
import {
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

export interface DataItem {
  label: string;
  value: string;
  desc?: string;
}

interface StockScreenerSelectProps {
  title: string;
  value?: string | null;
  data: DataItem[];
  width?: number;
  justify?: "start" | "end" | "center";
  clearable?: boolean;
  nothingFoundMessage?: string;
  onChange: (value: string | null) => void;
}

const StockScreenerSelect: FC<StockScreenerSelectProps> = props => {
  const {
    title,
    value,
    data,
    clearable,
    nothingFoundMessage,
    width = 250,
    justify = "center",
    onChange
  } = props;

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
          {item.desc && (
            <Text size="xs" c="gray">
              {item.desc}
            </Text>
          )}
        </Box>
        {currentValue === item.value ? <CheckIcon size={12} /> : null}
      </Group>
    </Combobox.Option>
  ));

  const getValueName = (value?: string | null) => {
    if (!value) return "";
    const item = data.find(item => item.value === value);
    return item ? item.label : "";
  };

  return (
    <Combobox
      width={width}
      store={combobox}
      position="bottom-start"
      withArrow
      onOptionSubmit={handleValueSelect}
    >
      <Combobox.Target withAriaAttributes={false}>
        <Button
          variant="outline"
          w={"auto"}
          justify={justify}
          onClick={() => combobox.toggleDropdown()}
        >
          {title}{" "}
          <Box mt={2} ml={8}>
            {getValueName(value)}
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
          <>
            <Group
              gap={5}
              p="5px 10px"
              onClick={handleClear}
              style={{ cursor: "pointer" }}
            >
              <IconX size={18} /> <Text size="sm">清空已选</Text>
            </Group>

            <Divider mb={10} />
          </>
        )}

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
