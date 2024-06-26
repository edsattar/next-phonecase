"use server";

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { db } from "@/db";

import { orders } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const createCheckoutSession = async ({
  configId,
}: {
  configId: string;
}) => {
  const configuration = await db.query.configurations.findFirst({
    where: (configurations, { eq }) => eq(configurations.id, configId),
  });

  if (!configuration) {
    throw new Error("No such configuration found");
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("You need to be logged in");
  }

  const { finish, material } = configuration;

  let price = BASE_PRICE;
  if (finish === "textured") price += PRODUCT_PRICES.finish.textured;
  if (material === "polycarbonate")
    price += PRODUCT_PRICES.material.polycarbonate;

  let order = await db.query.orders.findFirst({
    columns: { id: true },
    where: (orders, { and, eq }) =>
      and(
        eq(orders.userId, user.id),
        eq(orders.configurationId, configuration.id),
      ),
  });

  console.debug(user.id, configuration.id);

  if (!order) {
    [order] = await db
      .insert(orders)
      .values({
        userId: user.id,
        configurationId: configuration.id,
        amount: price / 100,
      })
      .returning({ id: orders.id });
  }

  const product = await stripe.products.create({
    name: "Custom iPhone Case",
    images: [configuration.imageUrl],
    default_price_data: {
      currency: "USD",
      unit_amount: price,
    },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    billing_address_collection: "required",
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    line_items: [{ price: product.default_price as string, quantity: 1 }],
    mode: "payment",
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["BD", "IN", "DE", "US", "AU", "CA"],
    },
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
  });

  return { url: stripeSession.url };
};
