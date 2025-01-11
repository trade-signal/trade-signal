import { useSession } from "next-auth/react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

export type AuthType = "signin" | "signup";

export const useLogin = () => {
  const { data: session } = useSession();

  const isLoggedIn = !!session;

  const [visible, { open, close }] = useDisclosure(false);
  const [authType, setAuthType] = useState<AuthType>("signin");

  const changeAuthType = (type: "signin" | "signup") => {
    setAuthType(type);
  };

  const showLoginModal = (type: AuthType) => {
    console.log("showLoginModal", type);
    changeAuthType(type);
    open();
  };

  return {
    visible,
    userInfo: session?.user,
    isLoggedIn,
    authType,
    open,
    close,
    showLoginModal
  };
};
