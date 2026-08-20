"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { getQueryClient } from "@/lib/query-client"
import { type ReactNode } from "react"

export function QueryProvider({ children }: { children: ReactNode }) {
    // getQueryClient() returns the same instance across re-renders on the browser
    const queryClient = getQueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* DevTools only load in development */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}