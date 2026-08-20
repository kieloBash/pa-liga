import { loginSchema } from "@/features/auth"
import { setSessionCookie, signToken } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { compare } from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate request body against the shared Zod schema
        const parsed = loginSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { message: parsed.error.issues[0].message },
                { status: 400 }
            )
        }

        const { email, password } = parsed.data

        // Find the user in the DB
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            )
        }

        // Compare the provided password with the hashed one
        const isValid = await compare(password, user.password)
        if (!isValid) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            )
        }

        // Sign the JWT and set it as an HTTP-only cookie
        const token = await signToken({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        })

        await setSessionCookie(token)

        return NextResponse.json({
            message: "Logged in successfully",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        })
    } catch (error) {
        console.error("[AUTH LOGIN]", error)
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        )
    }
}