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
          打造您的{" "}
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "blue", to: "red" }}
            inherit
          >
            智能投资
          </Text>{" "}
          数据分析平台
        </h1>

        <Text className={styles.description} c="dimmed">
          整合多维度市场数据，提供专业的投资分析工具。
          智能追踪市场动态，发现潜在投资机会，为您的每一个投资决策提供可靠的数据支撑。
        </Text>

        <Group className={styles.controls}>
          <Button
            size="xl"
            className={styles.control}
            variant="gradient"
            gradient={{ from: "blue", to: "red" }}
            onClick={() => router.push("/explore")}
          >
            立即体验
          </Button>

          <Button
            component="a"
            href="https://github.com/yzqzy"
            target="_blank"
            size="xl"
            variant="default"
            className={styles.control}
            leftSection={<IconBrandGithubFilled size={20} />}
          >
            GitHub
          </Button>
        </Group>
      </Container>
    </Box>
  );
}
