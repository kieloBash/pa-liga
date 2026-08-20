import { requireAuth } from "@/lib/auth"
import { type ReactNode } from "react"

export default async function OrganizerLayout({
    children,
}: {
    children: ReactNode
}) {
    // Second-layer server-side guard on top of middleware.
    // Returns the session payload — available to pass down as props if needed.
    await requireAuth()

    return (
        <div className="min-h-screen flex">
            {/* Organizer sidebar will be added here */}
            <main className="flex-1 p-6">{children}</main>
        </div>
    )
}