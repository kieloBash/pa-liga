import { z } from "zod"

// ─── ID params ────────────────────────────────────────────────────────────────

export const idSchema = z.object({
    id: z.string().min(1, "ID is required"),
})

export const leagueIdSchema = z.object({
    leagueId: z.string().min(1, "League ID is required"),
})

export const gameIdSchema = z.object({
    gameId: z.string().min(1, "Game ID is required"),
})

export const playerIdSchema = z.object({
    playerId: z.string().min(1, "Player ID is required"),
})

export const teamIdSchema = z.object({
    teamId: z.string().min(1, "Team ID is required"),
})

// ─── Pagination ───────────────────────────────────────────────────────────────

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type PaginationInput = z.infer<typeof paginationSchema>