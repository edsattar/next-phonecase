import { db } from '@/db'
import { notFound } from 'next/navigation'
import { DesignConfigurator } from './DesignConfigurator'
import { eq } from 'drizzle-orm'
import { configurations } from '@/db/schema'

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const Page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams

  if (!id || typeof id !== 'string') {
    return notFound()
  }

  const configuration = await db.query.configurations.findFirst({
    where: eq(configurations.id, id),
  })

  if (!configuration) {
    return notFound()
  }

  const { imageUrl, width, height } = configuration

  return (
    <DesignConfigurator
      configId={configuration.id}
      imageDimensions={{ width, height }}
      imageUrl={imageUrl}
    />
  )
}

export default Page