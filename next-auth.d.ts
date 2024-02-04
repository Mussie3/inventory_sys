import { DefaultSession, DefaultUser } from "next-auth";
import { ISODateString } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      picture: string;
      sub: string;
      role: string;
      iat: number;
      exp: number;
      jti: string;
    };
  }
}
