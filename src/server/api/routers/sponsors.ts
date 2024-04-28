/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Tier } from "@prisma/client";
import axios from "axios";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { v4 as uuidv4 } from "uuid";

export const sponsorsRouter = createTRPCRouter({
  getSponsor: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.sponsor.findFirst({
        where: {
          id: input,
        },
      });
    }),
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
      z.object({
        userId: z.string(),
        merchantId: z.string(),
        sponsors: z.array(
          z.object({
            id: z.string(),
            eventRequestId: z.string(),
            tier: z.string(),
            description: z.string(),
            sponsorsRequired: z.number(),
            amountPerSponsor: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.db.account.findFirst({
        where: {
          userId: input.userId,
        },
      });

      if (!account?.access_token || !account?.userId) {
        throw new Error("User not found");
      }

      const accessToken = account.access_token;

      const company = await ctx.db.company.findUnique({
        where: {
          squareMerchantId: input.merchantId,
        },
      });

      if (!company) {
        throw new Error(
          "User not found in company, required for sponsorship payment link creation",
        );
      }

      const location = await ctx.db.merchantLocation.findFirst({
        where: {
          companyId: company.id,
        },
      });

      if (!location?.locationId) {
        throw new Error(
          "Location not found for sponsor to create payment link",
        );
      }

      const squarePaymentApiUrl =
        process.env.NODE_ENV === "production"
          ? "https://connect.squareup.com/v2/online-checkout/payment-links"
          : "https://connect.squareupsandbox.com/v2/online-checkout/payment-links";

      try {
        await Promise.all(
          input.sponsors.map(async (sponsor) => {
            const response = await axios.post(
              squarePaymentApiUrl,
              {
                idempotency_key: uuidv4(),
                quick_pay: {
                  name: `Spark Sponsorship | Tier ${sponsor.tier}`,
                  price_money: {
                    amount: sponsor.amountPerSponsor * 100,
                    currency: "USD",
                  },
                  location_id: location.locationId,
                },
                checkout_options: {
                  redirect_url:
                    process.env.NODE_ENV === "production"
                      ? `https://spark-square.vercel.app/events/${sponsor.eventRequestId}`
                      : `http://localhost:3000/events/${sponsor.eventRequestId}`,
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
              throw new Error("Failed to create payment link");
            }

            console.log("PAYMENT LINK RESPONSE", response.data);
            return await ctx.db.sponsor.create({
              data: {
                id: sponsor.id,
                eventRequestId: sponsor.eventRequestId,
                tier: sponsor.tier as Tier,
                description: sponsor.description,
                sponsorsRequired: sponsor.sponsorsRequired,
                amountPerSponsor: sponsor.amountPerSponsor,
                paymentLink: response.data.payment_link.url,
                orderId: response.data.payment_link.order_id,
              },
            });
          }),
        );
        return "Successfully created sponsors and payment links";
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error response:", error.response);
        } else {
          console.error("Unexpected error:", error);
        }
      }
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const sponsor = await ctx.db.sponsor.findUnique({
        where: {
          id: input.sponsorId,
        },
      });

      if (!sponsor?.orderId) {
        throw new Error(
          "Sponsor not found when adding company through payment flow",
        );
      }

      try {
        const squarePayment = await ctx.db.sponsorPayments.create({
          data: {
            id: uuidv4(),
            sponsorId: input.sponsorId,
            companyId: input.companyId,
            squareOrderId: sponsor.orderId,
            createdAt: new Date(),
            paymentStatus: "PENDING",
          },
        });

        return squarePayment;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error response:", error.response);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }),
});
