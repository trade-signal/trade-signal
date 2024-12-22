import { Group, Text } from "@mantine/core";

interface DataTableFooterProps {
  firstLoading: boolean;
  total: number;
  dataLength: number;
  statisticsDate?: string;
  refreshTime?: string;
  orderBy?: string;
  order?: string;
  getOrderBy?: (orderBy: string, order?: string) => string;
}

const DataTableFooter = ({
  firstLoading,
  total,
  dataLength,
  statisticsDate,
  refreshTime,
  orderBy,
  order,
  getOrderBy
}: DataTableFooterProps) => (
  <Group justify="flex-end" mt="sm" gap="xs" style={{ height: 30 }}>
    {firstLoading ? (
      <Text size="sm" c="dimmed">
        数据加载中...
      </Text>
    ) : (
      <Group justify="space-between" w={refreshTime ? "100%" : "auto"}>
        {refreshTime && (
          <Text size="sm" c="dimmed">
            更新时间: {refreshTime}
          </Text>
        )}
        <Text size="sm" c="dimmed">
          {statisticsDate && `${statisticsDate} · `}
          {orderBy && getOrderBy && `${getOrderBy(orderBy, order)} · `}共{" "}
          {total} 条记录 ({dataLength}/{total})
        </Text>
      </Group>
    )}
  </Group>
);

export default DataTableFooter;
