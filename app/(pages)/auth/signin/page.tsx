"use client";

import { useRouter } from "next/navigation";
import AuthorizationModal from "@/app/components/AuthorizationModal";
import { useLogin } from "@/app/hooks/useLogin";

const SignIn = () => {
  const { isLoggedIn } = useLogin();
  const router = useRouter();

  if (isLoggedIn) {
    // 如果已经登录，则重定向到首页
    router.replace("/");
    return null;
  }

  return (
    <AuthorizationModal
      type="signin"
      withCloseButton={false}
      visible={true}
      onClose={() => {}}
    />
  );
};

export default SignIn;
