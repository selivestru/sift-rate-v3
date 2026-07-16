import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

export const TanstackQueryProvider = ({ children }: React.PropsWithChildren) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
