import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";

import { db } from "~/server/db";

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
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    {
      id: "square",
      name: "Square",
      type: "oauth",
      clientId: process.env.NODE_ENV === "production" ? process.env.SQUARE_PROD_CLIENT_ID : process.env.SQUARE_TEST_CLIENT_ID,
      clientSecret: process.env.NODE_ENV === "production" ? process.env.SQUARE_PROD_APP_SECRET : process.env.SQUARE_TEST_APP_SECRET,
      authorization: {
        url: process.env.NODE_ENV === "production" ? "https://connect.squareup.com/oauth2/authorize" : "https://connect.squareupsandbox.com/oauth2/authorize",
        params : { 
          scope: "MERCHANT_PROFILE_READ BANK_ACCOUNTS_READ",
        }
      },
      token: process.env.NODE_ENV === "production" ? "https://connect.squareup.com/oauth2/token" : "https://connect.squareupsandbox.com/oauth2/token",
      profile: (profile) => {
        return {
          id: profile.merchant_id,
          name: profile.business_name,
          email: profile.email, // Make sure these fields are adjusted based on the actual Square response
        };
      },
    },
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
