# PaLiga

A season management system for basketball leagues — built with Next.js, Prisma, Supabase, TanStack Query, and shadcn/ui.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js (App Router) | Framework — routing, server components, API routes |
| Prisma | ORM — database access and schema management |
| PostgreSQL (Supabase) | Database |
| Supabase Realtime | Live score and stat updates during games |
| Supabase Auth | Organizer authentication |
| TanStack React Query | Server state management, data fetching, mutations |
| Axios | HTTP client for API calls |
| Zod | Schema validation — shared between forms and API routes |
| shadcn/ui | Component library |
| Tailwind CSS | Styling |

---

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables and fill in your values
cp .env.example .env.local

# Generate the Prisma client
npx prisma generate

# Push the schema to your database
npx prisma db push

# Start the dev server
npm run dev

# for creating feature
npm run create-feature -- --name <name>
```

---

## Folder Structure

```
paliga/
├── app/
├── features/
├── components/
├── lib/
├── types/
├── providers/
├── prisma/
└── public/
```

---

## Folder Responsibilities

### `app/`
The Next.js App Router lives here. This folder is **routes only** — pages import components and call hooks, but contain no business logic, no direct API calls, and no inline validation.

- `app/(public)/` — publicly accessible pages (no login required): standings, schedule, game detail, team and player profiles.
- `app/(organizer)/` — organizer-only pages (authenticated): dashboard, team and roster management, schedule management, live stat entry.
- `app/api/` — API route handlers. Each route receives a request, validates the body against the feature's Zod schema, calls Prisma, and returns a response. No business logic beyond that.
- `app/generated/prisma/` — auto-generated Prisma client. **Never edit this folder manually.** Regenerate with `npx prisma generate`.

---

### `features/`
The core of the application. Each domain concept (games, teams, players, standings) gets its own feature folder. A new developer working on any feature only needs to look inside that one folder.

Every feature follows the same internal structure:

```
features/[feature]/
├── components/   # UI components used only within this feature
├── hooks/        # TanStack Query hooks (useQuery / useMutation wrappers)
├── services/     # Raw axios call functions — no React, no hooks
├── schemas/      # Zod validation schemas
├── types/        # TypeScript types specific to this domain
└── index.ts      # Barrel file — re-exports everything public-facing
```

**The rule:** if something is used only within one feature, it stays inside that feature. When a second feature needs it, it moves to the appropriate shared location.

#### `features/[feature]/components/`
React components that are only ever rendered within this feature. Examples: `live-scoreboard.tsx`, `stat-entry-pad.tsx`, `finalize-dialog.tsx`. If a component is needed by two features, it moves to `components/shared/`.

#### `features/[feature]/hooks/`
React hooks that wrap service functions with `useQuery` or `useMutation`. This is the only layer that imports from TanStack Query. Components call hooks — they never call service functions directly.

```ts
// hooks know about React Query
export const useGame = (gameId: string) =>
  useQuery({ queryKey: ["games", gameId], queryFn: () => getGame(gameId) })
```

#### `features/[feature]/services/`
Plain async functions that make HTTP requests via the configured axios instance. **No React, no hooks** — just functions that take inputs and return data. This makes them independently testable and reusable outside of React.

```ts
// services only know about axios
export const getGame = async (gameId: string) => {
  const { data } = await api.get(`/games/${gameId}`)
  return data
}
```

#### `features/[feature]/schemas/`
Zod schemas that define the shape of data for this feature. These are the **single source of truth** for validation — the same schema is used by the form on the client and the API route handler on the server. Never define validation in two places.

#### `features/[feature]/types/`
TypeScript types specific to this domain. These extend or compose Prisma-generated types — they never redefine them. Prisma types are imported from `@/app/generated/prisma` via `types/index.ts`.

#### `features/[feature]/index.ts`
The barrel file. Re-exports everything that other features or `app/` pages need from this feature. This keeps import paths clean throughout the codebase.

```ts
// ✅ Clean — import from the barrel
import { useGame, GameWithTeams } from "@/features/games"

// ❌ Avoid — deep import paths
import { useGame } from "@/features/games/hooks/use-game"
```

---

### `components/`
Shared UI components — things used across two or more features.

- `components/ui/` — shadcn/ui auto-generated components. **Never edit this folder.** Add components via `npx shadcn@latest add [component]`.
- `components/shared/` — cross-feature reusable components: `confirm-dialog.tsx`, `empty-state.tsx`, `loading-spinner.tsx`, etc.
- `components/layout/` — app shell components: `public-navbar.tsx`, `organizer-sidebar.tsx`, `footer.tsx`.

---

### `lib/`
Framework-level setup and utilities. Nothing in here is domain-specific.

- `lib/prisma.ts` — Prisma client singleton. Import `prisma` from here in all API routes.
- `lib/axios.ts` — Configured axios instance with base URL and error interceptors. Import `api` from here in all service files.
- `lib/query-client.ts` — TanStack QueryClient factory used by the QueryProvider.
- `lib/utils.ts` — General helpers: `cn()` for class merging, date formatters, and other stateless utilities.
- `lib/supabase/client.ts` — Browser-side Supabase client (auth + realtime subscriptions).
- `lib/supabase/server.ts` — Server-side Supabase client for use in Server Components and API routes.
- `lib/validators/common.schema.ts` — Shared Zod primitives used across multiple features: `idSchema`, `paginationSchema`, etc.

---

### `types/`
Global TypeScript types available everywhere in the app.

- `types/index.ts` — Re-exports Prisma-generated model types and defines shared API response shapes.

```ts
// Re-export Prisma types — never import from @/app/generated/prisma directly in feature files
export type { League, Team, Player, Game, PlayerGameStat } from "@/app/generated/prisma"

// Shared API response wrappers
export type ApiResponse<T> = { data: T; message?: string }
export type PaginatedResponse<T> = { data: T[]; total: number; page: number }
```

---

### `providers/`
React context providers that wrap the app.

- `providers/query-provider.tsx` — Mounts `QueryClientProvider` and `ReactQueryDevtools`. Imported in the root `app/layout.tsx`.

---

### `prisma/`
Prisma schema and migration files.

- `prisma/schema.prisma` — The database schema. Models: `League`, `Team`, `Player`, `Game`, `PlayerGameStat`, `PlayerOfTheGame`.

> **Note:** The Prisma client is generated to a custom path: `app/generated/prisma/`. Always import from `@/app/generated/prisma`, not `@prisma/client`.

---

### `public/`
Static assets served at the root URL — team logos, icons, placeholder images.

---

## Key Conventions

**1. Feature-local first, promote when shared.**
Start inside the feature. Move to `components/shared/`, `lib/validators/`, or `types/` only when a second feature needs it.

**2. Barrel files keep imports clean.**
Every feature has an `index.ts`. Always import from `@/features/[feature]`, never from deep internal paths.

**3. Services → Hooks → Components. Never skip a layer.**
Components call hooks. Hooks call services. Services call axios. Each layer has one job.

**4. One schema, two uses.**
The same Zod schema validates the form on the client and the request body in the API route.

**5. `app/` stays thin.**
If a page file is growing with logic, it belongs in a hook or service.

**6. Never manually edit auto-generated folders.**
`components/ui/` belongs to shadcn. `app/generated/prisma/` belongs to Prisma. Both are regenerated by their respective CLI tools.

**7. Prisma types flow through `types/index.ts`.**
Feature type files import from `@/types`, not directly from `@/app/generated/prisma`.
