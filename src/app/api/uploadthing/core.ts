import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import sharp from "sharp";
import { db } from "@/db";
import { configurations } from "@/db/schema";
import { eq } from "drizzle-orm";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .input(z.object({ configId: z.string().optional() }))
    .middleware(async ({ input }) => {
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const { configId } = metadata.input;

        const res = await fetch(file.url);
        const buffer = await res.arrayBuffer();

        const imgMetadata = await sharp(buffer).metadata();
        const { width, height } = imgMetadata;

        if (!configId) {
          const [configuration] = await db
            .insert(configurations)
            .values({
              imageUrl: file.url,
              height: height || 500,
              width: width || 500,
            })
            .returning();

          return { configId: configuration.id };
        } else {
          const [updatedConfiguration] = await db
            .update(configurations)
            .set({
              croppedImageUrl: file.url,
            })
            .where(eq(configurations.id, configId))
            .returning();

          return { configId: updatedConfiguration.id };
        }
      } catch (error) {
        console.error("onUploadComplete", error);
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
