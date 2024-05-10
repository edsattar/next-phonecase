import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

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

export type Configuration = typeof configurations.$inferSelect;
export type ConfigurationsUpdate = typeof configurations.$inferInsert;

export const users = sqliteTable("users", {
  id: text("id")
    .$default(() => createId())
    .primaryKey(),
  createdAt: text("created_at").$default(() => new Date().toISOString()),
  updatedAt: text("updated_at").$default(() => new Date().toISOString()),
  email: text("email").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders, { relationName: "user_orders" }),
}));

export const orderStatusEnum = [
  "fulfilled",
  "shipped",
  "awaiting_shipment",
] as const;

export const orders = sqliteTable("orders", {
  id: text("id")
    .$default(() => createId())
    .primaryKey(),
  createdAt: text("created_at").$default(() => new Date().toISOString()),
  updatedAt: text("updated_at").$default(() => new Date().toISOString()),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  configurationId: text("configuration_id")
    .notNull()
    .references(() => configurations.id, { onDelete: "cascade" }),
  shippingAddressId: text("shipping_address_id").references(
    () => shippingAddresses.id,
    { onDelete: "cascade" },
  ),
  billingAddressId: text("billing_address_id").references(
    () => billingAddresses.id,
    { onDelete: "cascade" },
  ),
  amount: real("amount").notNull(),
  isPaid: integer("is_paid", { mode: "boolean" }).default(false),
  status: text("status", { enum: orderStatusEnum }).default(
    "awaiting_shipment",
  ),
});

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
    relationName: "user_orders",
  }),
  configuration: one(configurations, {
    fields: [orders.configurationId],
    references: [configurations.id],
  }),
  shippingAddress: one(shippingAddresses, {
    fields: [orders.shippingAddressId],
    references: [shippingAddresses.id],
  }),
  billingAddress: one(billingAddresses, {
    fields: [orders.billingAddressId],
    references: [billingAddresses.id],
  }),
}));

export type Order = typeof orders.$inferSelect;
export type OrdersInsert = typeof orders.$inferInsert;

export const shippingAddresses = sqliteTable("shipping_addresses", {
  id: text("id")
    .$default(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  state: text("state"),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  street: text("street").notNull(),
  phone: text("phone"),
});

export const billingAddresses = sqliteTable("billing_addresses", {
  id: text("id")
    .$default(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  state: text("state"),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  street: text("street").notNull(),
  phone: text("phone"),
});
