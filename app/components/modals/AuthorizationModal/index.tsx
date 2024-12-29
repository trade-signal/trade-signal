import { useEffect, useState } from "react";
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
import { signIn } from "next-auth/react";
import { notifications } from "@mantine/notifications";
import { post } from "@/shared/request";
import { AuthType } from "@/app/providers/LoginProvider";

import { GoogleButton } from "./GoogleButton";
import { GithubButton } from "./GithubButton";

type FormValues = {
  email: string;
  password: string;
};

type AuthorizationModalProps = {
  type: AuthType;
  visible: boolean;
  withCloseButton?: boolean;
  onClose: () => void;
};

const AuthorizationModal = (props: AuthorizationModalProps) => {
  const { type, visible, withCloseButton = true, onClose } = props;

  const [currentType, setCurrentType] = useState(type);

  useEffect(() => {
    setCurrentType(type);
  }, [type]);

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

  const handleRegister = async () => {
    try {
      const response = await post("/api/register", { ...form.values });

      if (response.success) {
        notifications.show({
          title: "注册成功",
          message: response.message,
          color: "green"
        });

        // 注册成功后，自动登录
        handleSignIn(form.values, true);
        return;
      }

      notifications.show({
        title: "注册失败",
        message: response.message,
        color: "red"
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignIn = async (values: FormValues, isRegister?: boolean) => {
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false
      });

      if (result?.error) {
        notifications.show({
          title: "登录失败",
          message: result.error,
          color: "red"
        });
      }

      if (result?.ok) {
        if (!isRegister) {
          notifications.show({
            title: "登录成功",
            message: null,
            color: "green"
          });
        }
        handleClose();
      }
    } catch (error) {
      notifications.show({
        title: "登录失败",
        message: (error as Error).message,
        color: "red"
      });
    }
  };

  const handleAuth = () => {
    currentType === "signup" ? handleRegister() : handleSignIn(form.values);
  };

  const toogle = () => {
    setCurrentType(currentType === "signin" ? "signup" : "signin");
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isSignup = currentType === "signup";
  const passwordAutoComplete = isSignup ? "new-password" : "current-password";

  return (
    <Modal
      opened={visible}
      fullScreen
      radius={0}
      transitionProps={{ transition: "fade", duration: 200 }}
      onClose={handleClose}
      closeOnClickOutside={false}
      withCloseButton={withCloseButton}
    >
      <Paper w={400} m="auto" mt="10%" radius="md" p="xl" withBorder>
        <Text size="lg" fw={500} mb={20}>
          欢迎使用 TradeSignal
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl" onClick={() => signIn("google")}>
            Google
          </GoogleButton>
          <GithubButton radius="xl" onClick={() => signIn("github")}>
            Github
          </GithubButton>
        </Group>

        <Divider label="或使用邮箱登录" labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit(handleAuth)}>
          <Stack>
            {currentType === "signup" && (
              <TextInput
                required
                name="name"
                label="用户名"
                placeholder="请输入用户名"
                value={form.values.name}
                onChange={event =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
                radius="md"
                autoComplete="name"
                error={form.errors.name && "用户名不能为空"}
              />
            )}

            <TextInput
              required
              name="email"
              label="邮箱"
              placeholder="请输入邮箱"
              value={form.values.email}
              onChange={event =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "邮箱格式错误"}
              radius="md"
              autoComplete="email"
            />
            <PasswordInput
              required
              name="password"
              label="密码"
              placeholder="请输入密码"
              value={form.values.password}
              onChange={event =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={form.errors.password && "密码至少6位"}
              radius="md"
              autoComplete={passwordAutoComplete}
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
              {isSignup ? "已有账号？登录" : "没有账号？注册"}
            </Anchor>
            <Button type="submit" radius="xl">
              {isSignup ? "注册" : "登录"}
            </Button>
          </Group>
        </form>
      </Paper>
    </Modal>
  );
};

export default AuthorizationModal;
