import { type Tier } from "@prisma/client";
import axios from "axios";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { v4 as uuidv4 } from "uuid";

export const sponsorsRouter = createTRPCRouter({
  getSponsors: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.sponsor.findMany({
        where: {
          eventRequestId: input,
        },
      });
    }),
  addSponsors: publicProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          eventRequestId: z.string(),
          tier: z.string(),
          description: z.string(),
          sponsorsRequired: z.number(),
          amountPerSponsor: z.number(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.sponsor.createMany({
        data: input.map((sponsor) => ({
          id: sponsor.id,
          eventRequestId: sponsor.eventRequestId,
          tier: sponsor.tier as Tier,
          description: sponsor.description,
          sponsorsRequired: sponsor.sponsorsRequired,
          amountPerSponsor: sponsor.amountPerSponsor,
        })),
      });
    }),
  getTotalSponsors: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.sponsor.count({
        where: {
          eventRequestId: input,
        },
      });
    }),
  addCompanyAsSponsor: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        companyId: z.string(),
        sponsorId: z.string(),
        requesterMerchantId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.account.findFirst({
        where: {
          userId: input.userId,
        },
      });

      const accessToken = user?.access_token;
      const sponsor = await ctx.db.sponsor.findUnique({
        where: {
          id: input.sponsorId,
        },
      });

      const location = await ctx.db.merchantLocation.findFirst({
        where: {
          companyId: input.requesterMerchantId,
        },
      });

      if (!sponsor || !location) {
        throw new Error("Sponsor or location not found");
      }
      const url =
        "https://connect.squareupsandbox.com/v2/online-checkout/payment-links";

      try {
        const params = {
          idempotency_key: uuidv4(),
          quick_pay: {
            name: sponsor.tier,
            price_money: {
              amount: sponsor.amountPerSponsor,
              currency: "USD",
            },
            location_id: location.id,
          },
        };
        const response = await axios.post(url, params, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200) {
          console.log("response", response);
          console.log("failed params?", params);
          throw new Error("Failed to create payment link");
        }
        const data = response.data;
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error response:", error.response);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }),
});
