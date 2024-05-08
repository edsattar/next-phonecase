import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const phoneModelEnum = [
  "iphonex",
  "iphone11",
  "iphone12",
  "iphone13",
  "iphone14",
  "iphone15",
] as const;

export const caseMaterialEnum = ["silicone", "polycarbonate"] as const;

export const caseFinishEnum = ["smooth", "textured"] as const;

export const caseColorEnum = ["black", "blue", "rose"] as const;

export const orderStatusEnum = ["fulfilled", "shipped", "awaiting_shipment"] as const;

export const configurations = sqliteTable("configurations", {
  id: text("id")
    .$default(() => createId())
    .primaryKey(),
  imageUrl: text("image_url").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  croppedImageUrl: text("cropped_image_url"),
  color: text("color", { enum: caseColorEnum }),
  model: text("model", { enum: phoneModelEnum }),
  material: text("material", { enum: caseMaterialEnum }),
  finish: text("finish", { enum: caseFinishEnum }),
});

export type Configurations = typeof configurations.$inferSelect;
