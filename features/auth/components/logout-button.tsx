"use client"

import { useLogout } from "@/features/auth"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
    variant?: "default" | "ghost" | "outline"
    showIcon?: boolean
    showLabel?: boolean
}

export function LogoutButton({
    variant = "ghost",
    showIcon = true,
    showLabel = true,
}: LogoutButtonProps) {
    const { mutate: logout, isPending } = useLogout()

    return (
        <Button
            variant={variant}
            onClick={() => logout()}
            disabled={isPending}
        >
            {showIcon && <LogOut className="size-4" />}
            {showLabel && (isPending ? "Signing out..." : "Sign out")}
        </Button>
    )
}