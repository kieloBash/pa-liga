import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const COOKIE_NAME = "paliga_session"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

function getSecret() {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error("JWT_SECRET is not set in environment variables")
    return new TextEncoder().encode(secret)
}

// ─── Token helpers ────────────────────────────────────────────────────────────

export type JwtPayload = {
    id: string
    email: string
    name: string | null
    role: string
}

export async function signToken(payload: JwtPayload): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(getSecret())
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getSecret())
        return payload as unknown as JwtPayload
    } catch {
        return null
    }
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

export async function setSessionCookie(token: string) {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
    })
}

export async function clearSessionCookie() {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
}

// ─── Session helpers ──────────────────────────────────────────────────────────

/**
 * Reads and verifies the session cookie.
 * Returns the decoded payload or null if missing/invalid.
 */
export async function getSession(): Promise<JwtPayload | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    return verifyToken(token)
}

/**
 * Guards a server component or API route.
 * Redirects to /login if there is no valid session.
 */
export async function requireAuth(): Promise<JwtPayload> {
    const session = await getSession()
    if (!session) redirect("/login")
    return session
}

export { COOKIE_NAME }
