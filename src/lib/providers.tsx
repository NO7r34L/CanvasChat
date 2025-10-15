"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * TanStack Query Provider
 * Wraps the app with React Query for server state management
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cloudflare Workers benefit from slightly longer stale times
            staleTime: 60 * 1000, // 1 minute
            // Reduce refetching on window focus for better UX
            refetchOnWindowFocus: false,
            // Retry failed requests
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

