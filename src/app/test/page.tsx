import { db } from "@/db";

export default async function Test() {
  const order = await db.query.users.findMany({
    with: {
      orders: true,
    },
    where: (users, { eq }) =>
      eq(users.id, "kp_8797cb8cc98a4eb08943d52fc0cb1751"),
  });

  return <p>{JSON.stringify(order)}</p>;
}
