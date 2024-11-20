import { User } from "@prisma/client";

export interface JwtPayload {
  id: number;
  iat: number;
  exp: number;
  email: string;
}

export type UserInstance = User & {
  access_token?: string;
};