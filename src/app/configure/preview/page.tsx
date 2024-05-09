import { db } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import DesignPreview from "./DesignPreview";
import { configurations } from "@/db/schema";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const dynamic = "force-dynamic";

const Page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  // const configuration = await db.query.configurations.findFirst({
  //   where: (configurations, { eq }) => eq(configurations.id, id),
  // });

  const [configuration] = await db
    .select()
    .from(configurations)
    .where(eq(configurations.id, id))
    .limit(1);

  if (!configuration || !configuration.model || !configuration.color) {
    return notFound();
  }

  return <DesignPreview configuration={configuration} />;
};

export default Page;
