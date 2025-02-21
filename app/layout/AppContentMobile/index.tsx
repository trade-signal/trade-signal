import { Center, Text } from "@mantine/core";
import { IconDeviceLaptop } from "@tabler/icons-react";

const AppContentMobile = () => {
  return (
    <Center h="100vh" p="md">
      <div style={{ textAlign: "center" }}>
        <IconDeviceLaptop size={48} style={{ marginBottom: 20 }} />
        <Text size="lg" c="dimmed" fw={500} mb={10}>
          暂不支持移动端访问
        </Text>
        <Text size="sm" c="dimmed">
          请使用电脑浏览器访问本网站
        </Text>
      </div>
    </Center>
  );
};

export default AppContentMobile;
