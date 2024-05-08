"use server";

import { db } from "@/db";
import { Configuration, configurations } from "@/db/schema";
import { eq } from "drizzle-orm";

export type SaveConfigArgs = {
  values: Pick<Configuration, "color" | "model" | "material" | "finish">;
  configId: string;
};

export async function saveConfig({ values, configId }: SaveConfigArgs) {
  try {
    await db
      .update(configurations)
      .set(values)
      .where(eq(configurations.id, configId));
  } catch (error) {
    console.error(error);
  }
}
