import { type ServiceType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const collaboratorsRouter = createTRPCRouter({
  getCollaborators: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.collaborator.findMany({
        where: {
          eventRequestId: input,
        },
      });
    }),
  addCollaborators: publicProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          eventRequestId: z.string(),
          serviceType: z.string(),
          description: z.string(),
          collaboratorsRequired: z.number(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.collaborator.createMany({
        data: input.map((collaborator) => ({
          id: collaborator.id,
          eventRequestId: collaborator.eventRequestId,
          serviceType: collaborator.serviceType as ServiceType,
          description: collaborator.description,
          collaboratorsRequired: collaborator.collaboratorsRequired,
        })),
      });
    }),
});
