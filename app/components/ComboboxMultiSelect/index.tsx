import { useState, type FC } from "react";
import {
  PillsInput,
  Pill,
  Combobox,
  CheckIcon,
  Group,
  useCombobox,
  Text,
  ScrollArea
} from "@mantine/core";

interface ComboboxMultiSelectProps {
  title: string;
  data: string[];
  value: string[];
  placeholder: string;
  clearable?: boolean;
  nothingFoundMessage?: string;
  onChange: (value: string[]) => void;
}

const ComboboxMultiSelect: FC<ComboboxMultiSelectProps> = props => {
  const {
    title,
    data,
    value,
    placeholder,
    clearable,
    nothingFoundMessage,
    onChange
  } = props;

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active")
  });

  const [search, setSearch] = useState("");
  const [values, setValues] = useState<string[]>([]);

  const handleValueSelect = (val: string) =>
    setValues(current =>
      current.includes(val) ? current.filter(v => v !== val) : [...current, val]
    );

  const handleValueRemove = (val: string) =>
    setValues(current => current.filter(v => v !== val));

  const pills =
    values.length > 1 ? (
      <Pill>{values.length} 项</Pill>
    ) : (
      values.map(item => (
        <Pill
          key={item}
          withRemoveButton
          onRemove={() => handleValueRemove(item)}
        >
          {item}
        </Pill>
      ))
    );

  const options = data
    .filter(item => item.toLowerCase().includes(search.trim().toLowerCase()))
    .map(item => (
      <Combobox.Option value={item} key={item} active={value.includes(item)}>
        <Group gap="sm">
          <span>{item}</span>
          {values.includes(item) ? <CheckIcon size={12} /> : null}
        </Group>
      </Combobox.Option>
    ));

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
      <Combobox.DropdownTarget>
        <PillsInput onClick={() => combobox.openDropdown()}>
          <Group gap={5}>
            <Text style={{ fontSize: 14 }} c="gray">
              {title}
            </Text>
            <Pill.Group>{pills}</Pill.Group>
          </Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Search
          p="5px 10px"
          styles={{
            input: {
              border: "1px solid #e0e0e0",
              borderRadius: 5
            }
          }}
          value={search}
          placeholder={placeholder || "搜素"}
          onChange={event => {
            setSearch(event.currentTarget.value);
          }}
        />

        <Combobox.Options>
          <ScrollArea.Autosize type="scroll" mah={200}>
            {options.length > 0 ? (
              options
            ) : (
              <Combobox.Empty>
                <Text size="xs" color="gray">
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

export default ComboboxMultiSelect;
