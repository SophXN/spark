import { userRouter } from "~/server/api/routers/user";
import { eventsRouter } from "~/server/api/routers/events";
import { sponsorsRouter } from "~/server/api/routers/sponsors";
import { collaboratorsRouter } from "~/server/api/routers/collaborators";
import { companyRouter } from "~/server/api/routers/company";
import { collaboratorResponseRouter } from "~/server/api/routers/collaboratorResponse";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { merchantLocationRouter } from "./routers/merchantLocations";
import { imageHandlerRouter } from "./routers/imageHandler";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  events: eventsRouter,
  sponsors: sponsorsRouter,
  collaborators: collaboratorsRouter,
  company: companyRouter,
  collaboratorResponse: collaboratorResponseRouter,
  merchantLocations: merchantLocationRouter,
  imageHandler: imageHandlerRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
