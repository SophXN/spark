import { type OAuthConfig } from "next-auth/providers/oauth";
import { Client, Environment, type Merchant } from "square";
import { type TokenSetParameters } from "openid-client";
import { type Profile } from "next-auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OAuthProviderOptions = Pick<OAuthConfig<any>, "clientId" | "clientSecret">;

const env = process.env.NODE_ENV;
const callbackUrl =
  env === "production"
    ? `${process.env.NEXTAUTH_URL}`
    : `${process.env.NEXTAUTH_URL}/api/auth/callback/square`;

const squareClientConfig = {
  environment:
    env === "production" ? Environment.Production : Environment.Sandbox,
  userAgentDetail: "square-spark",
};

const SquareProvider = (
  options: OAuthProviderOptions,
): OAuthConfig<Merchant> => ({
  ...{
    id: "square",
    name: "Square",
    type: "oauth",
    version: "2.0",
    profile: async (profile) => {
      // must match Prisma User model
      return {
        id: profile.id ?? "", // ensure 'id' is always of type 'string'
        companyId: profile.id ?? "",
        email: `${(profile.businessName ?? "").replace(/\s+/g, "-").toLowerCase()}@square.com`, // dummy email
      };
    },
    callbackUrl,
    authorization: {
      url:
        env === "production"
          ? `${process.env.SQUARE_AUTH_PROD_URL}/authorize`
          : `${process.env.SQUARE_AUTH_SANDBOX_URL}/authorize`,
      params: {
        scope: "MERCHANT_PROFILE_READ ORDERS_READ ORDERS_WRITE PAYMENTS_WRITE",
      },
    },
  },
  token: {
    url:
      env === "production"
        ? `${process.env.SQUARE_AUTH_PROD_URL}/token`
        : `${process.env.SQUARE_AUTH_SANDBOX_URL}/token`,
    params: {
      scope: "MERCHANT_PROFILE_READ ORDERS_READ ORDERS_WRITE PAYMENTS_WRITE",
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
        console.log("TOKEN RESULT", result);
        // match interface for Account Prisma model
        const tokens: TokenSetParameters = {
          providerAccountId: result.merchantId,
          access_token: result.accessToken,
          refresh_token: result.refreshToken,
          expires_at: new Date().getTime() / 1000, // ms to sec to fit INT
          token_type: result.tokenType,
        };

        console.log("ACTUAL TOKEN??", tokens);
        return { tokens };
      } catch (error) {
        console.log(error);
        throw error; // or return a valid TokenSetParameters object
      }
    },
  },
  userinfo: {
    async request(context): Promise<Profile> {
      try {
        // refresh_token, expires_at can be used for refreshing access_token without manual sign in
        const { access_token, providerAccountId } = context.tokens;
        console.log("USER INFO ACCESS TOKEN", access_token);
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
        return result.merchant as Profile;
      } catch (error) {
        console.log(error);
      }
      return {} as Profile;
    },
  },
  ...options,
});

export default SquareProvider;
