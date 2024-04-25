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
        locationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.account.findFirst({
        where: {
          userId: input.userId,
        },
      });

      const accessToken = user?.access_token;
      console.log(user, "<= found user in SPONSORS router");
      const sponsor = await ctx.db.sponsor.findUnique({
        where: {
          id: input.sponsorId,
        },
      });
      if (!sponsor) {
        throw new Error("Sponsor not found");
      }
      const url =
        "https://connect.squareupsandbox.com/v2/online-checkout/payment-links";

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          params: {
            checkout_options: {},
            idempotency_key: uuidv4(),
            quick_pay: {
              name: "TEST PAYMENT ",
              price_money: {
                amount: sponsor.amountPerSponsor,
                currency: "USD",
              },
              location_id: "LNGBSQJ62R28Y",
            },
          },
        });

        const data = response.data;
        console.log(data, "<= data from Square API");
        // Handle the response data as needed
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error response:", error.response);
        } else {
          console.error("Unexpected error:", error);
        }
        console.log(error, "<= ANOTHER error from Square API");
      }

      await ctx.db.sponsor.update({
        where: {
          id: input.sponsorId,
        },
        data: {
          responders: {
            connect: {
              id: input.companyId,
            },
          },
        },
      });

      return sponsor;
    }),
});
