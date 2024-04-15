import { EventType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { HomePageResponse } from "~/types/types";

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
        },
      });
    }),
  getEvent: publicProcedure.query(async ({ ctx, input: eventId }) => {
    const event = await ctx.db.eventRequest.findUnique({
      where: { id: eventId },
    });
    return event !== null;
  }),
  getEventById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: eventId }) => {
      const event = await ctx.db.eventRequest.findUnique({
        where: { eventId: eventId },
        include: {
          sponsors: true,
          collaborators: true,
          requester: true,
          _count: {
            select: { sponsors: true , collaborators: true}
          }
        },
      });
      return event;
    }),
    getHomePageEvents: publicProcedure.query(async ({ ctx }) => {
      const events = await ctx.db.eventRequest.findMany({
        include: {
          sponsors: true,
          collaborators: true,
          requester: true,
          _count: {
            select: { sponsors: true , collaborators: true}
          }
        },
      });
      return events;
    })
});
