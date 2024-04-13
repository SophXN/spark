import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const companyRouter = createTRPCRouter({
  getCompany: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.company.findUnique({
        where: {
          id: input,
        },
      });
    }),
});
