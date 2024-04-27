import { any, z } from "zod";
import { createClient } from '@supabase/supabase-js'
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_API_KEY as string)

export const imageHandlerRouter = createTRPCRouter({
  updateBusinessProfileImage: protectedProcedure
  .input(z.object({
    bucket: z.string(),
    file: z.custom<File>()
  }),)
  .mutation(async ({ ctx, input }) => {
    const filePath = uuidv4()
    console.log(filePath)

    const { error: uploadError, data } = await supabase.storage.from(input.bucket).upload(filePath, input.file);
    if (uploadError) {
        throw uploadError;
    }
    console.log(data, " <= finished uploading")
    // const user = ctx.db.company.update({
    //     select: {

    //     }
    // });
    return;
  }),
});
