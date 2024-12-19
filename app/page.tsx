"use client";

import { Box, Button, Container, Group, Text } from "@mantine/core";
import { IconBrandGithubFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  return (
    <Box className={styles.wrapper} visibleFrom="xs">
      <Container size={700} className={styles.inner}>
        <h1 className={styles.title}>
          <Text component="span" inherit>
            交易信标
          </Text>
          <Text
            component="span"
            c="dimmed"
            inherit
            style={{
              marginLeft: "1rem",
              transform: "translateY(4px)"
            }}
          >
            TradeSignal
          </Text>
        </h1>

        <Text className={styles.description} c="dimmed">
          整合多维度市场数据，提供专业的投资分析工具。
          智能追踪市场动态，发现潜在投资机会，为您的每一个投资决策提供可靠的数据支撑。
        </Text>

        <Group className={styles.controls}>
          <Button
            variant="outline"
            className={styles.control}
            onClick={() => router.push("/stock")}
            size="xl"
          >
            立即体验
          </Button>

          <Button
            component="a"
            href="https://github.com/trade-signal"
            target="_blank"
            variant="default"
            className={styles.control}
            leftSection={<IconBrandGithubFilled size={20} />}
            size="xl"
          >
            GitHub
          </Button>
        </Group>
      </Container>
    </Box>
  );
}
