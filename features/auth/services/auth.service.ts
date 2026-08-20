import api from "@/lib/axios"
import type { LoginInput } from "@/features/auth"
import type { AuthUser } from "@/features/auth"

export async function loginWithEmail(input: LoginInput): Promise<AuthUser> {
    const { data } = await api.post<{ user: AuthUser }>("/auth/login", input)
    return data.user
}

export async function logout(): Promise<void> {
    await api.post("/auth/logout")
}