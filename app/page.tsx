import { Button, Container, Group, Stack, Text } from "@mantine/core";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <Container size={750} className={styles.inner}>
        <h1 className={styles.title}>
          一个强大的{" "}
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "green", to: "red", deg: 45 }}
            inherit
          >
            智能投资
          </Text>{" "}
          分析工具
        </h1>

        <Text className={styles.description} color="dimmed">
          提供全面的实时市场数据和专业的分析功能，帮助用户做出更加明智的投资决策。
          通过先进的技术，打造您的智能投资助手，让投资决策更简单、更科学、更高效。
        </Text>

        <Group mt="md" className={styles.controls}>
          <Button
            size="md"
            className={styles.control}
            variant="gradient"
            bg="red"
          >
            开始探索
          </Button>
        </Group>
      </Container>
    </div>
  );
}
