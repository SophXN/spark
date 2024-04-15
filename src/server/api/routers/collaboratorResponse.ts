import { CollaboratorResponseStatus } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const collaboratorResponseRouter = createTRPCRouter({
  getAllCollaboratorResponses: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.collaboratorResponse.findMany({
        where: {
          eventRequestId: input,
        },
      });
    }),
  getCountOfApprovedCollaboratorResponses: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.collaboratorResponse.count({
        where: {
          eventRequestId: input,
          status: CollaboratorResponseStatus.ACCEPTED,
        },
      });
    }),
  getCountOfCollaboratorResponses: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.collaboratorResponse.count({
        where: {
          eventRequestId: input,
        },
      });
    }),
});
