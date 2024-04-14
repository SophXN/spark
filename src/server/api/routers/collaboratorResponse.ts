import { type Tier } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const collaboratorResponseRouter = createTRPCRouter({
  getAllCollaboratorResponses: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.collaboratorResponse.findMany({
        where: {
          collaboratorId: input,
        },
      });
    }),
});
