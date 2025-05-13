import { Group, Text } from "@mantine/core";

import {
  IconHelp,
  IconInfoCircle,
  IconBrandTelegram,
  IconBrandGithub,
  IconLink
} from "@tabler/icons-react";
import { getCurrentYear } from "@trade-signal/shared";

import styles from "./index.module.css";

const Footer = () => {
  const year = getCurrentYear();

  return (
    <footer className={styles.footer}>
      <Group w="100%" justify="space-between" px="xs">
        <Group gap="lg">
          <Text size="sm">© {year} TradeSignal</Text>
        </Group>
        <Group gap="lg">
          <Group gap={4}>
            <IconHelp width={18} height={18} />
            <Text size="sm">使用教程</Text>
          </Group>

          {/* <Group gap={4}>
            <IconInfoCircle width={18} height={18} />
            <Text size="sm">关于我们</Text>
          </Group> */}

          {/* <Group gap={4}>
            <IconLink width={18} height={18} />
            <Text size="sm">API</Text>
          </Group> */}

          <Group gap={4}>
            <IconBrandTelegram
              width={18}
              height={18}
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.open("https://t.me/+25mzy3YRvbA4ODM1", "_blank");
              }}
            />
            <Text size="sm">Telegram</Text>
          </Group>

          <Group gap={4}>
            <IconBrandGithub
              width={18}
              height={18}
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.open("https://github.com/trade-signal", "_blank");
              }}
            />
            <Text size="sm">Github</Text>
          </Group>
        </Group>
      </Group>
    </footer>
  );
};

export default Footer;
