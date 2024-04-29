/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Tier, type PaymentLink } from "@prisma/client";
import axios from "axios";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "next-auth/react";

export const sponsorsRouter = createTRPCRouter({
  getSponsor: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.sponsor.findFirst({
        where: {
          id: input,
        },
        include: {
          paymentLinks: {
            where: {
              paymentStatus: "PENDING",
            },
          },
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
  updateSponsorPaymentStatus: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data: sessionData } = useSession();
      const userId = sessionData?.user?.id;
      if (!userId) {
        throw new Error("User not found");
      }
      const user = await ctx.db.account.findFirst({
        where: {
          userId: userId,
        },
      });

      const accessToken = user?.access_token;
      if (!accessToken) {
        throw new Error("User access token not found");
      }
      // get the order from square for the payment id
      const squareOrdersApiUrl =
        process.env.NODE_ENV === "production"
          ? "https://connect.squareup.com/v2/orders"
          : "https://connect.squareupsandbox.com/v2/orders";

      const ordersResponse = await axios.get(
        `${squareOrdersApiUrl}/${input.orderId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!ordersResponse.data?.tenders[0]?.payment_id) {
        throw new Error("Payment ID not found in order");
      }

      // get the payment from square for the status
      const squarePaymentDataApiUrl =
        process.env.NODE_ENV === "production"
          ? "https://connect.squareup.com/v2/payments"
          : "https://connect.squareupsandbox.com/v2/payments";

      const paymentsDataResponse = await axios.get(
        `${squarePaymentDataApiUrl}/${ordersResponse.data?.tenders[0]?.payment_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!paymentsDataResponse.data?.status) {
        throw new Error("Payment ID not found in order");
      }

      // update status of payment link ATTEMPTED -> VALIDATED
      const paymentLink = await ctx.db.paymentLink.findFirst({
        where: {
          squareOrderId: input.orderId,
        },
      });

      if (!paymentLink) {
        throw new Error("Payment link not found, cannot update status");
      }

      if (paymentsDataResponse.data?.status !== "COMPLETED") {
        throw new Error("Payment not completed");
      }

      await ctx.db.paymentLink.update({
        where: {
          id: paymentLink.id,
        },
        data: {
          paymentStatus: "VALIDATED",
        },
      });

      // update status of sponsor payment also PENDING -> COMPLETED
      const sponsorPayment = await ctx.db.sponsorPayments.findFirst({
        where: {
          squareOrderId: input.orderId,
        },
      });

      if (!sponsorPayment) {
        throw new Error("Sponsor payment not found, cannot update status");
      }

      await ctx.db.sponsorPayments.update({
        where: {
          id: sponsorPayment.id,
        },
        data: {
          paymentStatus: "COMPLETED",
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
            await ctx.db.sponsor.create({
              data: {
                id: sponsor.id,
                eventRequestId: sponsor.eventRequestId,
                tier: sponsor.tier as Tier,
                description: sponsor.description,
                sponsorsRequired: sponsor.sponsorsRequired,
                amountPerSponsor: sponsor.amountPerSponsor,
              },
            });
            const sponsorsRequiredLinks = Array.from(
              { length: sponsor.sponsorsRequired },
              (_, i) => i,
            );
            await Promise.all(
              sponsorsRequiredLinks.map(async () => {
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
                  throw new Error(
                    `Failed to create payment link for Sponsor Tier ${sponsor.tier} - ${sponsor.description}`,
                  );
                }
                if (!response.data.payment_link.url) {
                  throw new Error(
                    `Payment link URL not found for Sponsor Tier ${sponsor.tier} - ${sponsor.description}`,
                  );
                }

                try {
                  await ctx.db.paymentLink.create({
                    data: {
                      id: uuidv4(),
                      sponsorId: sponsor.id,
                      paymentLink: response.data.payment_link.url,
                      paymentStatus: "PENDING",
                      squareOrderId: response.data.payment_link.order_id,
                      createdAt: new Date(),
                    },
                  });
                } catch (error) {
                  console.error("Error creating payment link", error);
                }

                const paymentLinks = await ctx.db.paymentLink.findMany({
                  where: {
                    sponsorId: sponsor.id,
                  },
                });
                return paymentLinks;
              }),
            );
          }),
        );
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
        paymentLinkOrderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const sponsor = await ctx.db.sponsor.findUnique({
        where: {
          id: input.sponsorId,
        },
      });

      const paymentLink = await ctx.db.paymentLink.findFirst({
        where: {
          squareOrderId: input.paymentLinkOrderId,
        },
      });
      if (!paymentLink) {
        throw new Error("Payment link not found, cannot update status");
      }

      await ctx.db.paymentLink.update({
        where: {
          id: paymentLink.id, // Update the property name from 'sponsorId' to 'id'
        },
        data: {
          paymentStatus: "ATTEMPTED",
        },
      });

      if (!sponsor) {
        throw new Error("Sponsor not found");
      }

      try {
        const squarePayment = await ctx.db.sponsorPayments.create({
          data: {
            id: uuidv4(),
            sponsorId: input.sponsorId,
            companyId: input.companyId,
            squareOrderId: input.paymentLinkOrderId,
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
