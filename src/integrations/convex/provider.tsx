import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL
if (!CONVEX_URL) {
  console.error('Missing environment variable: VITE_CONVEX_URL')
}

const convexQueryClient = new ConvexQueryClient(CONVEX_URL)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

convexQueryClient.connect(queryClient)

export function ConvexProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthProvider client={convexQueryClient.convexClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConvexAuthProvider>
  )
}

export default ConvexProviders
