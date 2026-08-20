import { Role } from "@/app/generated/prisma/enums"

export type AuthUser = {
    id: string
    email: string
    name: string | null
    role: Role
}