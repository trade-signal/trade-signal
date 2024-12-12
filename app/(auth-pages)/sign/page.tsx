"use client";

import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { GoogleButton } from "./GoogleButton";
import { GithubButton } from "./GithubButton";
import { useRouter, useSearchParams } from "next/navigation";

const SignIn = props => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  const initialType = ["login", "register"].includes(type) ? type : "login";

  const toggleAuthType = () => {
    const newType = type === "register" ? "login" : "register";
    router.push(`/sign?type=${newType}`);
  };

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

  return (
    <Paper w={400} m="auto" mt={100} radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500}>
        欢迎使用 TradeSignal
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
        <GithubButton radius="xl">Github</GithubButton>
      </Group>

      <Divider label="或使用邮箱登录" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(() => {})}>
        <Stack>
          {type === "register" && (
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
            onClick={toggleAuthType}
            size="xs"
          >
            {type === "register" ? "已有账号？登录" : "没有账号？注册"}
          </Anchor>
          <Button type="submit" radius="xl">
            {type === "register" ? "注册" : "登录"}
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default SignIn;
