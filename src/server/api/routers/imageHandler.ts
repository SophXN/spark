import { z } from "zod";
import { createClient } from '@supabase/supabase-js'
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { v4 as uuidv4 } from "uuid";
import { decode } from 'base64-arraybuffer'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_API_KEY!)

export const imageHandlerRouter = createTRPCRouter({
  uploadImageToStorage: protectedProcedure
  .input(z.object({
    bucket: z.string(),
    file: z.string(),
    contentType: z.string().optional()
  }))
  .mutation(async ({ ctx, input }) => {
    const filePath = uuidv4()
    console.log(input)

    const base64 = input.file.split('base64,')[1]

    const { error: uploadError, data } = await supabase.storage
      .from(input.bucket)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
      .upload(filePath, decode(base64!), {contentType: input.contentType});
    if (uploadError) {
        throw uploadError;
    }
    const imageFullUrl = process.env.SUPABASE_URL + "/storage/v1/object/public/" + input.bucket + "/" + data.path;

    console.log(imageFullUrl);
    return imageFullUrl;

  }),
});
