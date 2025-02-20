import { ReactNode, createContext, useContext } from "react";
import { SessionUser } from "next-auth";
import AuthorizationModal from "@/app/components/AuthorizationModal";
import { AuthType, useLogin } from "@/app/hooks/useLogin";

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
