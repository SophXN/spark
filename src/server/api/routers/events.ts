import { EventType, CollaboratorResponseStatus } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import axios from "axios";

function generateUrl(baseUrl: string, params: Record<string, string | number>): string {
  const url = new URL(baseUrl);
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, value.toString());
  }

  url.search = searchParams.toString();
  return url.toString();
}

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

      const baseUrl = 'https://api.unsplash.com/photos/';
      const queryParams = {
        page: 1,
        query: input.description,
        per_page: 1,
        orientation: "landscape"
      }
      const url = generateUrl(baseUrl, queryParams);

      console.log(input, "<= query");
      const accessKey = process.env.UNSPLASH_ACCESS_KEY;
      try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Client-ID ${accessKey}`,
            'Content-Type': 'application/json',
            'Accept-Version': "v1"
          }
        });

        const images = response.data[0].urls.regular;
        console.log(images, ", <= images")
        return await ctx.db.eventRequest.create({
          data: {
            eventId: input.eventId,
            requesterId: input.requesterId,
            title: input.title,
            image: images,
            description: input.description,
            eventDate: input.eventDate,
            eventLocation: input.eventLocation,
            createdOn: input.createdOn,
            eventType: EventType[input.eventType as keyof typeof EventType],
          },
        })
      }
      catch (err) {
        console.log(err);
      };
    }),
  getEvent: publicProcedure.query(async ({ ctx, input: eventId }) => {
    const event = await ctx.db.eventRequest.findUnique({
      where: { id: eventId },
    });
    return event !== null;
  }),
  getEventPageDetails: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: eventId }) => {
      const event = await ctx.db.eventRequest.findUnique({
        where: { eventId: eventId },
        include: {
          sponsors: true,
          collaborators: true,
          requester: true,
          collaboratorsResponses: true,
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
          select: {
            collaboratorsResponses: {
              where: {
                status: CollaboratorResponseStatus.ACCEPTED,
              },
            },
          },
        },
      },
    });
    return events;
  }),
  getEventCollaboratorResponses: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: eventId }) => {
      const events = await ctx.db.eventRequest.findMany({
        where: { eventId: eventId },
        include: {
          requester: true,
          collaborators: {
            include: {
              responses: true,
            },
          },
          collaboratorsResponses: {
            include: {
              responder: true,
            },
          },
        },
      });
      return events;
    }),
});
