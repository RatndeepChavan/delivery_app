import type { UserRoleType } from "#/enums/userRoles.enum";

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRoleType;
    } & DefaultSession["user"];
    accessToken: string;
    refreshToken: string;
    expiry: number;
    error?: string;
  }

  interface User {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRoleType;
    };
    token: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
    expiry: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    role: UserRoleType;
    accessToken: string;
    refreshToken: string;
    expiry: number;
    error?: string;
  }
}
