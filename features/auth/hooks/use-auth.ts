"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { loginWithEmail, logout } from "@/features/auth"
import type { LoginInput } from "@/features/auth"

export function useLogin() {
    const router = useRouter()

    return useMutation({
        mutationFn: (input: LoginInput) => loginWithEmail(input),
        onSuccess: () => {
            router.push("/dashboard")
            router.refresh()
        },
    })
}

export function useLogout() {
    const router = useRouter()

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            router.push("/login")
            router.refresh()
        },
    })
}