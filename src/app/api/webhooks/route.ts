import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
// import { Resend } from "resend";
// import OrderReceivedEmail from "@/components/emails/OrderReceivedEmail";
import { billingAddresses, orders, shippingAddresses } from "@/db/schema";
import { eq } from "drizzle-orm";

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    if (event.type === "checkout.session.completed") {
      if (!event.data.object.customer_details?.email) {
        throw new Error("Missing user email");
      }

      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.metadata || !session.customer_details?.address) {
        throw new Error("Invalid request metadata");
      }

      const { orderId } = session.metadata;

      const billingAddress = session.customer_details!.address;
      const shippingAddress = session.shipping_details!.address;
      let billingAddressId: string;
      let shippingAddressId: string | null = null;

      [{ billingAddressId }] = await db
        .insert(billingAddresses)
        .values({
          name: session.customer_details.name!,
          city: billingAddress.city!,
          country: billingAddress.country!,
          postalCode: billingAddress.postal_code!,
          street: billingAddress.line1!,
          state: billingAddress.state,
        })
        .returning({ billingAddressId: billingAddresses.id });

      if (shippingAddress) {
        [{ shippingAddressId }] = await db
          .insert(shippingAddresses)
          .values({
            name: session.customer_details.name!,
            city: shippingAddress.city!,
            country: shippingAddress.country!,
            postalCode: shippingAddress.postal_code!,
            street: shippingAddress.line1!,
            state: shippingAddress.state,
          })
          .returning({ shippingAddressId: shippingAddresses.id });
      }

      const [ updatedOrder ] = await db
        .update(orders)
        .set({
          isPaid: true,
          shippingAddressId,
          billingAddressId,
        })
        .where(eq(orders.id, orderId))
        .returning();

      // await resend.emails.send({
      //   from: "CaseCobra <hello@joshtriedcoding.com>",
      //   to: [event.data.object.customer_details.email],
      //   subject: "Thanks for your order!",
      //   react: OrderReceivedEmail({
      //     orderId,
      //     orderDate: updatedOrder.createdAt,
      //     // @ts-ignore
      //     shippingAddress: {
      //       name: session.customer_details!.name!,
      //       city: shippingAddress!.city!,
      //       country: shippingAddress!.country!,
      //       postalCode: shippingAddress!.postal_code!,
      //       street: shippingAddress!.line1!,
      //       state: shippingAddress!.state,
      //     },
      //   }),
      // });
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 },
    );
  }
}
