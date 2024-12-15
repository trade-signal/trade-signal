import { DefaultSession } from "next-auth";

declare module "next-auth" {
  type SessionUser = {
    id: string;
  } & DefaultSession["user"];

  interface Session extends DefaultSession {
    user: SessionUser;
  }
}
