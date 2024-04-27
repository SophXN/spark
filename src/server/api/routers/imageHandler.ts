import { any, z } from "zod";
import { createClient } from '@supabase/supabase-js'
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { v4 as uuidv4 } from "uuid";
import { FileObj } from "~/hooks/useImageUploader";

const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_API_KEY as string)

export const imageHandlerRouter = createTRPCRouter({
  uploadImageToStorage: protectedProcedure
  .input(z.custom<FileObj>())
  .mutation(async ({ ctx, input }) => {
    const filePath = uuidv4()
    console.log(input)
    if(input.file == null){
      throw "No file found";
    }
    const { error: uploadError, data } = await supabase.storage
      .from(input.bucket)
      .upload(filePath, input.file, {contentType: input.contentType});
    if (uploadError) {
        throw uploadError;
    }
    console.log(data, " <= finished uploading")
    const imageFullUrl = process.env.SUPABASE_URL + "/storage/v1/object/public/" + data.fullPath;

    return imageFullUrl;
  }),

});
