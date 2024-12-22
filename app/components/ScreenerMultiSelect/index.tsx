import { useState, useEffect, type FC } from "react";
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

export interface DataItem {
  label: string;
  value: string;
  desc?: string;
}

interface StockScreenerMultiSelectProps {
  title: string;
  data: DataItem[];
  value?: string[];
  disabled?: boolean;
  searchable?: boolean;
  placeholder?: string;
  clearable?: boolean;
  nothingFoundMessage?: string;
  onChange: (value: string[]) => void;
}

const StockScreenerMultiSelect: FC<StockScreenerMultiSelectProps> = props => {
  const {
    title,
    data,
    value = [],
    disabled = false,
    searchable = false,
    clearable = false,
    placeholder,
    nothingFoundMessage,
    onChange
  } = props;

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active")
  });

  const [search, setSearch] = useState("");
  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    setValues(value);
  }, [value]);

  useEffect(() => {
    if (combobox.dropdownOpened) {
      setSearch("");
    }
  }, [combobox.dropdownOpened]);

  const handleValueSelect = (val: string) => {
    if (disabled) return;

    const newValues = values.includes(val)
      ? values.filter(v => v !== val)
      : [...values, val];

    setValues(newValues);
    onChange(newValues);
  };

  const handleClear = () => {
    setValues([]);
    onChange([]);
  };

  const getItemName = (value: string) => {
    const item = data.find(item => item.value === value);
    return item ? item.label : "";
  };

  const pills =
    values.length > 1 ? (
      <Pill c="indigo">{values.length} 项</Pill>
    ) : (
      values.map(item => (
        <Text key={item} size="xs">
          {getItemName(item)}
        </Text>
      ))
    );

  const options = data
    .filter(item =>
      item.label.toLowerCase().includes(search.trim().toLowerCase())
    )
    .map(item => (
      <Combobox.Option
        value={item.value}
        key={item.value}
        active={value.includes(item.value)}
      >
        <Group gap="sm">
          <span>{item.label}</span>
          {values.includes(item.value) ? <CheckIcon size={12} /> : null}
        </Group>
      </Combobox.Option>
    ));

  return (
    <Combobox
      width={250}
      store={combobox}
      position="bottom-start"
      withArrow
      disabled={disabled}
      onOptionSubmit={handleValueSelect}
    >
      <Combobox.Target withAriaAttributes={false}>
        <Button
          variant="outline"
          w={"auto"}
          onClick={() => {
            if (disabled) return;
            combobox.toggleDropdown();
          }}
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
            backgroundColor: disabled ? "#f0f0f0" : "",
            borderColor: disabled ? "#e0e0e0" : "",
            color: disabled ? "#808080" : ""
          }}
        >
          {title}{" "}
          <Box mt={2} ml={8}>
            {pills}
          </Box>
          <Box ml={values.length > 0 ? 6 : 0}>
            {combobox.dropdownOpened ? (
              <IconChevronUp size={14} />
            ) : (
              <IconChevronDown size={14} />
            )}
          </Box>
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown styles={{ dropdown: { zIndex: 1000 } }}>
        {clearable && values.length > 0 && (
          <Group
            gap={5}
            p="5px 10px"
            onClick={handleClear}
            style={{ cursor: "pointer" }}
          >
            <IconX size={18} /> <Text size="sm">清空已选</Text>
          </Group>
        )}

        {values.length > 0 && <Divider mb={10} />}

        {searchable && (
          <Combobox.Search
            p="5px 10px"
            styles={{
              input: {
                border: "1px solid #e0e0e0",
                borderRadius: 5
              }
            }}
            value={search}
            placeholder={placeholder || "搜索"}
            onChange={event => {
              setSearch(event.currentTarget.value);
            }}
          />
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

export default StockScreenerMultiSelect;
