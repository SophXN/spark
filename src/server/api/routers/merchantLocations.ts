/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import axios from "axios";

const locationSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.object({
    address_line_1: z.string().optional(),
    locality: z.string().optional(),
    administrative_district_level_1: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
  }),
  timezone: z.string(),
  capabilities: z.array(z.string()), // Assuming capabilities are an array of strings
  status: z.string(), // Example: Enum, adjust based on possible values
  created_at: z.string(), // or use z.date() if you want to parse the string into a Date object
  merchant_id: z.string(),
  country: z.string(),
  language_code: z.string(),
  currency: z.string(),
  business_name: z.string(),
  type: z.string(), // Assuming these types, adjust as necessary
  business_hours: z.record(z.string()), // Simple representation, use a more specific schema if needed
  mcc: z.string(),
});

const locationDisplaySchema = locationSchema.transform((location) => ({
  id: location.id,
  name: location.name,
  address:
    location.address.address_line_1 +
    ", " +
    location.address.postal_code +
    ", " +
    location.address.country,
  companyId: location.merchant_id,
  city: location.address.locality,
  type: location.type,
  merchantCode: location.mcc,
}));

const locationsArraySchema = z.array(locationDisplaySchema);

export const merchantLocationRouter = createTRPCRouter({
  addLocations: publicProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          companyId: z.string(),
          city: z.string(),
          type: z.string(),
          merchantCode: z.string(),
          locationId: z.string(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.merchantLocation.createMany({
        data: input.map((location) => ({
          id: location.id,
          companyId: location.companyId,
          city: location.city,
          type: location.type,
          merchantCode: location.merchantCode,
          locationId: location.locationId,
        })),
      });
    }),
  getLocations: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.account.findFirst({
        where: {
          userId: input,
        },
      });

      const accessToken = user?.access_token;

      console.log(user, ", <= user");
      const url =
        process.env.NODE_ENV === "production"
          ? "https://connect.squareup.com/v2/locations"
          : "https://connect.squareupsandbox.com/v2/locations";

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        const displayLocations = locationsArraySchema.parse(
          response.data.locations,
        );

        console.log(displayLocations, ", <= location square data");

        return displayLocations; // Returning just the locations part
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error response:", error.response);
        } else {
          console.error("Unexpected error:", error);
        }
        throw new Error("Failed to fetch locations from Square API");
      }
    }),
});
