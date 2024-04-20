import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { CollaboratorResponseStatus } from "@prisma/client";

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
  createCompany: publicProcedure
    .input(
      z.object({
        name: z.string(),
        squareMerchantId: z.string(),
        squareLocationId: z.string(),
        businessDescription: z.string(), 
        facebookUrl: z.string().optional(),
        twitterUrl: z.string().optional(),
        instagramUrl: z.string().optional()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.db.company.create({
        data: {
          name: input.name,
          squareMerchantId: input.squareMerchantId,
          squareLocationId: input.squareLocationId,
          businessDescription: input.businessDescription,
          facebookUrl: input.facebookUrl,
          twitterUrl: input.twitterUrl,
          instagramUrl: input.instagramUrl,
        },
      });
      return company;
    }),
  filterCompanies: publicProcedure
    .input(
      z.object({
        city: z.string().optional(),
        type: z.string().optional(),
        merchantCode: z.string().optional(),
      }),
    ).query(async ({ ctx, input }) => {
      return await ctx.db.company.findMany({
        where: {
          locations: {
            some: input
          }
        },
        include: {
          locations: true,
          collaboratorResponses: true,
          _count: {
            select: {
              eventRequests: true,
              collaboratorResponses: {
                where: {
                  status: CollaboratorResponseStatus.ACCEPTED,
                },
              },
            }
          }
        },
      });
    }),
});
