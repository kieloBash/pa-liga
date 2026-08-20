import { NextResponse } from "next/server"
import { clearSessionCookie } from "@/lib/auth"

export async function POST() {
    try {
        await clearSessionCookie()
        return NextResponse.json({ message: "Logged out successfully" })
    } catch (error) {
        console.error("[AUTH LOGOUT]", error)
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        )
    }
}