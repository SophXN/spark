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
        eventType: z.string(),
        sponsors: z.array(z.string()),
        collaborators: z.array(z.string()),
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
          eventType: EventType[input.eventType as keyof typeof EventType],
          sponsors: {
            connect: input.sponsors.map((sponsorId) => ({ id: sponsorId })),
          },
          collaborators: {
            connect: input.collaborators.map((collaboratorId) => ({
              id: collaboratorId,
            })),
          },
        },
      });
    }),
});
