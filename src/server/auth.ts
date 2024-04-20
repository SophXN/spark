import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type User,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";

import { db } from "~/server/db";
import SquareProvider from "./square-provider/square";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt(context) {
      // console.log('jwt context', context);
      const { token, user } = context;

      if (user) {
        token.user = user;
      }
      return token;
    },
    async session(context) {
      // console.log('session context', context);
      const { session, token } = context;
      const user = token.user as User;

      if (session && user) {
        session.user = user;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    SquareProvider({
      clientId:
        process.env.NODE_ENV === "production"
          ? process.env.SQUARE_PROD_CLIENT_ID
          : process.env.SQR_SANDBOX_APPLICATION_ID,
      clientSecret:
        process.env.NODE_ENV === "production"
          ? process.env.SQUARE_PROD_APP_SECRET
          : process.env.SQR_SANDBOX_APPLICATION_SECRET,
    }),
    // {
    //   id: "square",
    //   name: "Square",
    //   type: "oauth",
    //   version: "2.0",
    //   clientId:
    //     process.env.NODE_ENV === "production"
    //       ? process.env.SQUARE_PROD_CLIENT_ID
    //       : process.env.SQR_SANDBOX_APPLICATION_ID,
    //   clientSecret:
    //     process.env.NODE_ENV === "production"
    //       ? process.env.SQUARE_PROD_APP_SECRET
    //       : process.env.SQR_SANDBOX_APPLICATION_SECRET,
    //   authorization: {
    //     url: "https://connect.squareupsandbox.com/oauth2/authorize",
    //     params: {
    //       scope: "MERCHANT_PROFILE_READ",
    //     },
    //   },

    //   // checks: ["state"],
    //   token: {
    //     url: "https://connect.squareupsandbox.com/oauth2/token",
    //     params: {
    //       scope: "MERCHANT_PROFILE_READ",
    //     },
    //   },
    //   profile: (profile) => {
    //     return {
    //       id: profile.merchant_id,
    //       name: profile.business_name,
    //       email: profile.email, // Make sure these fields are adjusted based on the actual Square response
    //     };
    //   },
    // },

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug(code, metadata);
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1h
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
