import { QueryClient } from "@tanstack/react-query"

export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // On SSR, don't refetch immediately on client mount
                staleTime: 60 * 1000, // 1 minute
                refetchOnWindowFocus: false,
                retry: 1,
            },
            mutations: {
                // Mutations don't retry by default — fail fast and let the UI handle it
                retry: false,
            },
        },
    })
}

let browserQueryClient: QueryClient | undefined = undefined

/**
 * Returns a singleton QueryClient on the browser.
 * Always creates a new one on the server (to avoid shared state between requests).
 */
export function getQueryClient() {
    if (typeof window === "undefined") {
        return makeQueryClient()
    }
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
}