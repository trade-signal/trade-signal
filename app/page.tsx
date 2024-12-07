import {
  Button,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text
} from "@mantine/core";
import styles from "./page.module.css";

const features = [
  {
    title: "精准的技术指标计算",
    description: "MACD、RSI、KDJ 等核心指标实时分析"
  },
  {
    title: "智能形态识别",
    description: "头肩顶、双底、红三兵等典型形态自动检测"
  },
  {
    title: "多维度选股策略",
    description: "基于技术面、基本面等多维度综合筛选系统"
  },
  {
    title: "个性化策略构建",
    description: "灵活定制您的专属选股条件，满足不同投资偏好"
  }
  // {
  //   title: "历史数据回测",
  //   description: "验证策略有效性，优化投资决策"
  // },
  // {
  //   title: "智能交易执行",
  //   description: "设置条件单，自动执行交易指令"
  // }
];

export default function Home() {
  const items = features.map((item, index) => (
    <div className={styles.item} key={index}>
      <div>
        <Text fw={700} fz="lg" className={styles.itemTitle}>
          {item.title}
        </Text>
        <Text c="dimmed">{item.description}</Text>
      </div>
    </div>
  ));

  return (
    <div className={styles.wrapper}>
      <Container size={800} className={styles.inner}>
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

        <SimpleGrid
          cols={{ base: 1, xs: 2 }}
          spacing={40}
          verticalSpacing={40}
          mt={50}
        >
          {items}
        </SimpleGrid>

        <Text
          c="dimmed"
          fz="sm"
          ta="center"
          mt={50}
          className={styles.disclaimer}
        >
          免责声明：本工具提供的所有分析结果仅供参考，不构成任何投资建议。
          投资有风险，入市需谨慎。请在使用本工具时充分认识投资风险，根据自身情况做出独立判断。
          <br />
          <em className={styles.warning}>
            富贵险中求，也在险中丢；求时十之一，丢时十之九。
          </em>
        </Text>
      </Container>
    </div>
  );
}
