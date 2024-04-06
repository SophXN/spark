import { EventType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const eventsRouter = createTRPCRouter({
  createEvent: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        requesterId: z.string(),
        title: z.string(),
        description: z.string(),
        eventDate: z.date(),
        eventLocation: z.string(),
        createdOn: z.date(),
        expireOn: z.date(),
        eventType: z.string(),
        requiresSponsor: z.boolean(),
        isActive: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.eventRequest.create({
        data: {
          eventId: input.eventId,
          requesterId: input.requesterId,
          title: input.title,
          description: input.description,
          eventDate: input.eventDate,
          eventLocation: input.eventLocation,
          createdOn: input.createdOn,
          expireOn: input.expireOn,
          eventType: EventType[input.eventType as keyof typeof EventType],
          requiresSponsor: input.requiresSponsor,
          isActive: input.isActive,
        },
      });
    }),
});
