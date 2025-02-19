import { HoverCard, Text } from "@mantine/core";
import { readLocalStorageValue } from "@mantine/hooks";
import { THEME_SETTING_KEY } from "@/app/hooks/useThemeSetting";

import { getColor, formatPercent } from "./formatters";
import { formatDateDiff } from "./date";

export const renderPercent = (value: number, decimals = 2) => {
  const val = formatPercent(value, decimals, false);
  return (
    <Text span c={getColor(Number(val))} fw={700}>
      {val}%
    </Text>
  );
};

export const renderSignal = (value: boolean) => {
  const themeSetting: any = readLocalStorageValue({ key: THEME_SETTING_KEY });
  if (value) {
    return (
      <Text span c={themeSetting.upColor} fw={700}>
        ✓
      </Text>
    );
  }
  return (
    <Text span c={themeSetting.downColor} fw={700}>
      ✗
    </Text>
  );
};

export const renderTimeWithHover = (value: string) => {
  const { relativeTime, date } = formatDateDiff(value);

  return (
    <HoverCard position="top">
      <HoverCard.Target>
        <Text size="sm">{relativeTime}</Text>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="xs" c="gray.7" fw={500}>
          {date}
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
