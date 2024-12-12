import {
  Anchor,
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { GoogleButton } from "./GoogleButton";
import { GithubButton } from "./GithubButton";
import { useState } from "react";

type FormValues = {
  email: string;
  name?: string;
  password: string;
};

export type AuthType = "signin" | "signup";

type AuthorizationModalProps = {
  type: AuthType;
  visible: boolean;
  onClose: () => void;
};

const AuthorizationModal = (props: AuthorizationModalProps) => {
  const { type, visible, onClose } = props;

  const [currentType, setCurrentType] = useState(type);

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: ""
    },

    validate: {
      email: val => (/^\S+@\S+$/.test(val) ? null : "邮箱格式错误"),
      password: val => (val.length <= 6 ? "密码至少6位" : null)
    }
  });

  const handleConfirm = (values: FormValues) => {
    console.log(values);
  };

  const toogle = () => {
    setCurrentType(currentType === "signin" ? "signup" : "signin");
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={visible}
      fullScreen
      radius={0}
      transitionProps={{ transition: "fade", duration: 200 }}
      onClose={handleClose}
      closeOnClickOutside={false}
    >
      <Paper w={400} m="auto" mt="10%" radius="md" p="xl" withBorder>
        <Text size="lg" fw={500} mb={20}>
          欢迎使用 TradeSignal
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
          <GithubButton radius="xl">Github</GithubButton>
        </Group>

        <Divider label="或使用邮箱登录" labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit(handleConfirm)}>
          <Stack>
            {currentType === "signup" && (
              <TextInput
                label="用户名"
                placeholder="请输入用户名"
                value={form.values.name}
                onChange={event =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
                radius="md"
              />
            )}

            <TextInput
              required
              label="邮箱"
              placeholder="请输入邮箱"
              value={form.values.email}
              onChange={event =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
              radius="md"
            />

            <PasswordInput
              required
              label="密码"
              placeholder="请输入密码"
              value={form.values.password}
              onChange={event =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
              radius="md"
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={toogle}
              size="xs"
            >
              {currentType === "signup" ? "已有账号？登录" : "没有账号？注册"}
            </Anchor>
            <Button type="submit" radius="xl">
              {currentType === "signup" ? "注册" : "登录"}
            </Button>
          </Group>
        </form>
      </Paper>
    </Modal>
  );
};

export default AuthorizationModal;
