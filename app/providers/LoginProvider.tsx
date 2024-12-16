import { ReactNode, createContext, useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { useDisclosure } from "@mantine/hooks";
import { SessionUser } from "next-auth";
import AuthorizationModal from "@/app/components/modals/AuthorizationModal";

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

export interface LoginContextType {
  visible: boolean;
  authType: AuthType;
  isLoggedIn: boolean;
  userInfo?: SessionUser;
  close: () => void;
  showLoginModal: (type: AuthType) => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const { visible, authType, close, showLoginModal, isLoggedIn, userInfo } =
    useLogin();

  return (
    <LoginContext.Provider
      value={{ visible, authType, close, showLoginModal, isLoggedIn, userInfo }}
    >
      {children}

      <AuthorizationModal visible={visible} type={authType} onClose={close} />
    </LoginContext.Provider>
  );
};

export const useLoginContext = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLoginContext must be used within a LoginProvider");
  }
  return context;
};
