"use client";

import { Button, Container, Group, Text } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import Footer from "./layout/Footer";

import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Container visibleFrom="xs" size={700} className={styles.wrapper}>
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
            onClick={() => router.push("/products/screener")}
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
            leftSection={<IconBrandGithub width={20} height={20} />}
            size="xl"
          >
            GitHub
          </Button>
        </Group>
      </Container>

      <Footer />
    </>
  );
}
