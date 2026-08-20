# PaLiga — Folder Structure & Architecture Convention

**Version:** 1.1
**Date:** August 20, 2026

## Overview

This document defines the agreed folder structure and the conventions behind it. All contributors should read this before adding new files.

---

## Prisma Setup

Prisma is initialized with a **custom output path**:

```bash
npx prisma init --output ../app/generated/prisma
```

This means the generated client lives at `app/generated/prisma/` — **not** the default `node_modules/@prisma/client`. All imports must use the custom path:

```ts
// ✅ Correct
import { PrismaClient } from "@/app/generated/prisma"

// ❌ Wrong
import { PrismaClient } from "@prisma/client"
```

The `prisma/schema.prisma` generator block reflects this:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../app/generated/prisma"
}
```

---

## Full Structure

```
paliga/
├── app/                              # Next.js App Router — routes only, no business logic
│   ├── generated/
│   │   └── prisma/                   # Auto-generated Prisma client — never edit manually
│   │
│   ├── (public)/                     # Public routes — no auth required
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Home / landing
│   │   ├── standings/
│   │   │   └── page.tsx
│   │   ├── schedule/
│   │   │   └── page.tsx
│   │   ├── games/
│   │   │   └── [gameId]/
│   │   │       └── page.tsx
│   │   ├── teams/
│   │   │   └── [teamId]/
│   │   │       └── page.tsx
│   │   └── players/
│   │       └── [playerId]/
│   │           └── page.tsx
│   │
│   ├── (organizer)/                  # Organizer routes — authenticated
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── teams/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [teamId]/
│   │   │       ├── page.tsx
│   │   │       └── players/
│   │   │           └── new/
│   │   │               └── page.tsx
│   │   ├── schedule/
│   │   │   ├── page.tsx
│   │   │   ├── generate/
│   │   │   │   └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   └── games/
│   │       └── [gameId]/
│   │           ├── page.tsx
│   │           └── live/
│   │               └── page.tsx      # Live stat entry screen
│   │
│   ├── api/                          # API route handlers
│   │   ├── leagues/[leagueId]/
│   │   │   ├── schedule/generate/route.ts
│   │   │   └── standings/route.ts
│   │   ├── teams/
│   │   │   ├── route.ts
│   │   │   └── [teamId]/
│   │   │       ├── route.ts
│   │   │       └── players/route.ts
│   │   ├── games/
│   │   │   ├── route.ts
│   │   │   └── [gameId]/
│   │   │       ├── route.ts
│   │   │       ├── start/route.ts
│   │   │       ├── finalize/route.ts
│   │   │       ├── potg/route.ts
│   │   │       └── stats/
│   │   │           ├── route.ts
│   │   │           ├── undo/route.ts
│   │   │           └── [statId]/route.ts
│   │   └── players/
│   │       └── [playerId]/
│   │           └── stats/route.ts
│   │
│   └── layout.tsx                    # Root layout — mounts QueryProvider, Toaster
│
│
├── features/                         # Domain features — the core of the app
│   │
│   │   # Each feature follows the same internal structure:
│   │   #
│   │   #   components/   — UI used only within this feature
│   │   #   hooks/        — useQuery / useMutation wrappers
│   │   #   services/     — raw axios call functions
│   │   #   schemas/      — Zod validation schemas
│   │   #   types/        — TypeScript types for this domain
│   │   #   index.ts      — barrel file re-exporting everything public-facing
│   │
│   ├── games/
│   │   ├── components/
│   │   │   ├── game-card.tsx
│   │   │   ├── game-status-badge.tsx
│   │   │   ├── box-score-table.tsx
│   │   │   ├── live-scoreboard.tsx
│   │   │   ├── stat-entry-pad.tsx
│   │   │   ├── player-roster-list.tsx
│   │   │   └── finalize-dialog.tsx
│   │   ├── hooks/
│   │   │   ├── use-game.ts
│   │   │   ├── use-games.ts
│   │   │   └── use-live-stats.ts
│   │   ├── services/
│   │   │   └── games.service.ts
│   │   ├── schemas/
│   │   │   └── game.schema.ts
│   │   ├── types/
│   │   │   └── games.types.ts
│   │   └── index.ts
│   │
│   ├── teams/
│   │   ├── components/
│   │   │   ├── team-card.tsx
│   │   │   └── roster-list.tsx
│   │   ├── hooks/
│   │   │   ├── use-team.ts
│   │   │   └── use-teams.ts
│   │   ├── services/
│   │   │   └── teams.service.ts
│   │   ├── schemas/
│   │   │   └── team.schema.ts
│   │   ├── types/
│   │   │   └── teams.types.ts
│   │   └── index.ts
│   │
│   ├── players/
│   │   ├── components/
│   │   │   ├── player-card.tsx
│   │   │   ├── player-avatar.tsx
│   │   │   └── player-stat-line.tsx
│   │   ├── hooks/
│   │   │   ├── use-player.ts
│   │   │   └── use-player-stats.ts
│   │   ├── services/
│   │   │   └── players.service.ts
│   │   ├── schemas/
│   │   │   └── player.schema.ts
│   │   ├── types/
│   │   │   └── players.types.ts
│   │   └── index.ts
│   │
│   └── standings/
│       ├── components/
│       │   └── standings-table.tsx
│       ├── hooks/
│       │   └── use-standings.ts
│       ├── services/
│       │   └── standings.service.ts
│       ├── types/
│       │   └── standings.types.ts
│       └── index.ts
│
│
├── components/                       # Shared UI — used across 2+ features
│   ├── ui/                           # shadcn auto-generated — never edit manually
│   ├── shared/                       # Cross-feature reusable components
│   │   ├── confirm-dialog.tsx
│   │   ├── empty-state.tsx
│   │   ├── loading-spinner.tsx
│   │   └── stat-badge.tsx
│   └── layout/                       # App shell components
│       ├── public-navbar.tsx
│       ├── organizer-sidebar.tsx
│       └── footer.tsx
│
│
├── lib/                              # Framework-level utilities and clients
│   ├── prisma.ts                     # Prisma singleton
│   ├── axios.ts                      # Configured axios instance
│   ├── query-client.ts               # TanStack QueryClient factory
│   ├── utils.ts                      # cn(), date formatters, misc helpers
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   └── server.ts                 # Server Supabase client (SSR)
│   └── validators/
│       └── common.schema.ts          # Shared Zod primitives (idSchema, paginationSchema)
│
│
├── types/
│   └── index.ts                      # Global types + Prisma re-exports + API response shapes
│
│
├── providers/
│   └── query-provider.tsx            # QueryClientProvider + ReactQueryDevtools
│
│
├── prisma/
│   └── schema.prisma
│
└── public/                           # Static assets (logos, icons, images)
```

---

## Core Conventions

### 1. Feature-local first, promote when shared
If a component, hook, schema, or type is used only within one feature, it lives inside that feature folder. The moment it is needed by a second feature or by `app/`, it moves to the appropriate shared location (`components/shared/`, `lib/validators/`, `types/`).

### 2. Barrel files (`index.ts`) per feature
Every feature exposes a single `index.ts` that re-exports everything other parts of the app need. Components are imported directly from their file path, not re-exported through the barrel.

```ts
// features/games/index.ts
export * from "./hooks/use-game"
export * from "./hooks/use-live-stats"
export * from "./services/games.service"
export * from "./schemas/game.schema"
export * from "./types/games.types"
```

This keeps import paths clean across the codebase:
```ts
// ✅ Clean
import { useGame, GameWithTeams } from "@/features/games"

// ❌ Avoid
import { useGame } from "@/features/games/hooks/use-game"
```

### 3. Services are plain functions, hooks are React wrappers
`services/` files contain only axios call functions — no React, no hooks. `hooks/` files wrap those service functions with `useQuery` or `useMutation`. This makes services independently testable and reusable outside of React components.

### 4. Schemas are the single source of truth
The same Zod schema in `features/[feature]/schemas/` validates the form on the client and the request body in the API route. Never define validation in two places.

### 5. `app/` routes stay thin
Pages in `app/` import components and call hooks. No business logic, no direct axios calls, no inline Zod schemas. If logic is creeping into a page file, it belongs in a hook or service.

### 6. Never manually edit auto-generated folders
- `components/ui/` — owned by shadcn CLI
- `app/generated/prisma/` — owned by `prisma generate`

Customize shadcn components via composition, not direct edits.

### 7. Prisma types are re-exported from one place
```ts
// types/index.ts
export type { League, Team, Player, Game, PlayerGameStat } from "@/app/generated/prisma"
```
Feature type files extend or compose these — they never re-define them.

---

## Where things go — quick reference

| What | Where |
|---|---|
| Page/route | `app/` |
| API handler | `app/api/` |
| Prisma generated client | `app/generated/prisma/` — auto-generated, do not edit |
| Feature component (used in 1 feature) | `features/[feature]/components/` |
| Shared component (used in 2+ features) | `components/shared/` |
| shadcn component | `components/ui/` |
| Shell / nav / layout | `components/layout/` |
| Data fetching hook | `features/[feature]/hooks/` |
| Axios call function | `features/[feature]/services/` |
| Zod schema (feature-specific) | `features/[feature]/schemas/` |
| Zod schema (shared primitive) | `lib/validators/common.schema.ts` |
| TypeScript types (feature-specific) | `features/[feature]/types/` |
| TypeScript types (global / Prisma) | `types/index.ts` |
| DB client, axios instance, utilities | `lib/` |
| React context providers | `providers/` |