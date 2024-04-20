/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type OAuthConfig } from "next-auth/providers/oauth";
import { Client, Environment, Merchant } from "square";
import { type TokenSetParameters } from "openid-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OAuthProviderOptions = Pick<OAuthConfig<any>, "clientId" | "clientSecret">;

const callbackUrl = `${process.env.NEXTAUTH_URL}/api/auth/callback/square`;

const squareClientConfig = {
  environment: Environment.Sandbox,
  userAgentDetail: "first-app",
};

const SquareProvider = (
  options: OAuthProviderOptions,
): OAuthConfig<Merchant> => ({
  ...{
    id: "square",
    name: "Square",
    type: "oauth",
    version: "2.0",
    profile: (profile) => {
      // must match Prisma User model
      return {
        id: profile.id, // id will be overwritten
        companyId: profile.id,
        email: `${profile.businessName.replace(/\s+/g, "-").toLowerCase()}@square.com`, // dummy email
      };
    },
    callbackUrl,
    authorization: {
      url: "https://connect.squareupsandbox.com/oauth2/authorize",
      params: {
        scope: "MERCHANT_PROFILE_READ",
      },
    },
  },
  token: {
    url: "https://connect.squareupsandbox.com/oauth2/token",
    params: {
      scope: "MERCHANT_PROFILE_READ",
    },
    async request(context) {
      try {
        const { code } = context.params;

        const squareClient = new Client(squareClientConfig);
        const oauthInstance = squareClient.oAuthApi;
        const { result } = await oauthInstance.obtainToken({
          code,
          redirectUri: callbackUrl, // must pass it here too
          clientId: options.clientId!,
          clientSecret: options.clientSecret,
          grantType: "authorization_code",
        });

        // match interface for Account Prisma model
        const tokens: TokenSetParameters = {
          providerAccountId: result.merchantId,
          access_token: result.accessToken,
          refresh_token: result.refreshToken,
          expires_at: new Date().getTime() / 1000, // ms to sec to fit INT
          token_type: result.tokenType,
        };

        return { tokens };
      } catch (error) {
        console.log(error);
      }
    },
  },
  userinfo: {
    async request(context) {
      try {
        // refresh_token, expires_at can be used for refreshing access_token without manual sign in
        const { access_token, providerAccountId, refresh_token, expires_at } =
          context.tokens;

        // create Api client
        // must create new client with accessToken
        const squareClient = new Client({
          ...squareClientConfig,
          accessToken: access_token,
        });
        const { result } = await squareClient.merchantsApi.retrieveMerchant(
          providerAccountId as string,
        );

        // match request() signature
        return result.merchant as any;
      } catch (error) {
        console.log(error);
      }
    },
  },
  ...options,
});

export default SquareProvider;
