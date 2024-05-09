import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignPreview from "./DesignPreview";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Page = async ({ searchParams }: PageProps) => {

  const { id } = searchParams;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  const configuration = await db.query.configurations.findFirst({
    where: (configurations, { eq }) => eq(configurations.id, id),
  });

  if (!configuration) {
    return notFound();
  }

  return <DesignPreview configuration={configuration} />
};

export default Page;
