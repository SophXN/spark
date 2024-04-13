import { type Tier } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
});
