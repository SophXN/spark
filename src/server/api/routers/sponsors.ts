/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

      if (!sponsor || !location?.locationId) {
        throw new Error("Sponsor or location not found");
      }

      const url =
        process.env.NODE_ENV === "production"
          ? "https://connect.squareup.com/v2/online-checkout/payment-links"
          : "https://connect.squareupsandbox.com/v2/online-checkout/payment-links";

      try {
        console.log(
          "amount",
          sponsor.amountPerSponsor,
          "\nlocation",
          location.locationId,
        );
        const response = await axios.post(
          url,
          {
            idempotency_key: uuidv4(),
            quick_pay: {
              name: `Spark Sponsorship | Tier ${sponsor.tier}`,
              price_money: {
                amount: sponsor.amountPerSponsor,
                currency: "USD",
              },
              // TODO: Change this to the actual location ID
              location_id: `${location.locationId}`,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.status !== 200 || !response.data.payment_link) {
          console.log("response", response);

          throw new Error("Failed to create payment link");
        }
        console.log("MAYBE ERRORS: ", response.data.errors);

        const data = response.data;
        const squarePayment = await ctx.db.sponsorPayments.create({
          data: {
            id: uuidv4(),
            sponsorId: input.sponsorId,
            companyId: input.companyId,
            squareOrderId: data.related_resources.orders[0].id,
            createdAt: new Date(),
            paymentStatus: data.related_resources.orders[0].state,
          },
        });

        console.log("squarePayment", squarePayment);
        return data.payment_link.url as string;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error response:", error.response);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }),
});
