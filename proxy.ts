import { COOKIE_NAME } from "@/lib/auth"
import { jwtVerify } from "jose"
import { NextResponse, type NextRequest } from "next/server"

const ORGANIZER_PATHS = ["/dashboard", "/teams", "/schedule", "/games"]
const PUBLIC_ONLY_PATHS = ["/login"]

function isOrganizerPath(pathname: string) {
    return ORGANIZER_PATHS.some((path) => pathname.startsWith(path))
}

function isPublicOnlyPath(pathname: string) {
    return PUBLIC_ONLY_PATHS.some((path) => pathname.startsWith(path))
}

async function getTokenPayload(token: string) {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
        const { payload } = await jwtVerify(token, secret)
        return payload
    } catch {
        return null
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get(COOKIE_NAME)?.value
    const payload = token ? await getTokenPayload(token) : null
    const isAuthenticated = !!payload

    // Unauthenticated user trying to access organizer routes → /login
    if (!isAuthenticated && isOrganizerPath(pathname)) {
        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = "/login"
        return NextResponse.redirect(loginUrl)
    }

    // Authenticated user trying to access /login → /dashboard
    if (isAuthenticated && isPublicOnlyPath(pathname)) {
        const dashboardUrl = request.nextUrl.clone()
        dashboardUrl.pathname = "/dashboard"
        return NextResponse.redirect(dashboardUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}