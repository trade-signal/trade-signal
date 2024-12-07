"use client";

import { Button, Container, Group, Text, Title } from "@mantine/core";
import styles from "./not-found.module.css";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  return (
    <Container className={styles.root}>
      <div className={styles.label}>404</div>
      <Title className={styles.title}>页面未找到</Title>
      <Text c="dimmed" size="lg" ta="center" className={styles.description}>
        很抱歉,这只是一个404页面。你可能输入了错误的地址,或者该页面已经被移动到其他URL。
      </Text>
      <Group justify="center">
        <Button variant="subtle" size="md" onClick={() => router.push("/")}>
          返回首页
        </Button>
      </Group>
    </Container>
  );
};

export default NotFound;
