'use client'

import { QueryClientProvider as Provider, QueryClient } from '@tanstack/react-query'

const client = new QueryClient()

export const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider client={client}>{children}</Provider>
}
