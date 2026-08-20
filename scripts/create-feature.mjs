#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ─── Parse args ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const nameIndex = args.indexOf("--name")

if (nameIndex === -1 || !args[nameIndex + 1]) {
    console.error("❌  Usage: npm run create-feature -- --name <feature-name>")
    process.exit(1)
}

const rawName = args[nameIndex + 1].toLowerCase().replace(/\s+/g, "-")

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toCamel(str) {
    return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function toPascal(str) {
    const camel = toCamel(str)
    return camel.charAt(0).toUpperCase() + camel.slice(1)
}

function writeFile(filePath, content) {
    const dir = path.dirname(filePath)
    fs.mkdirSync(dir, { recursive: true })
    if (fs.existsSync(filePath)) {
        console.log(`  ⚠️  Already exists — skipped: ${filePath}`)
        return
    }
    fs.writeFileSync(filePath, content, "utf8")
    console.log(`  ✅  Created: ${filePath}`)
}

// ─── Derived names ───────────────────────────────────────────────────────────

const name = rawName
const pascal = toPascal(name)
const camel = toCamel(name)
const base = `features/${name}`

// ─── File templates ───────────────────────────────────────────────────────────

const files = {

    [`${base}/schemas/${name}.schema.ts`]:
        `import { z } from "zod"

// TODO: define your ${pascal} schemas here
// export const create${pascal}Schema = z.object({})
// export type Create${pascal}Input = z.infer<typeof create${pascal}Schema>
`,

    [`${base}/types/${name}.types.ts`]:
        `// TODO: define ${pascal} types here
// import type { ${pascal} } from "@/types"

// export type ${pascal}WithRelations = ${pascal} & {}
`,

    [`${base}/services/${name}.service.ts`]:
        `import api from "@/lib/axios"
// import type { Create${pascal}Input } from "@/features/${name}"

// TODO: add ${pascal} service functions here
// export async function get${pascal}s() {
//   const { data } = await api.get("/${camel}s")
//   return data
// }
`,

    [`${base}/hooks/use-${name}.ts`]:
        `// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { } from "@/features/${name}"

// TODO: add ${pascal} hooks here
// export function use${pascal}s() {
//   return useQuery({
//     queryKey: ["${camel}s"],
//     queryFn: get${pascal}s,
//   })
// }
`,

    [`${base}/index.ts`]:
        `// Services
// export {} from "./services/${name}.service"

// Hooks
// export {} from "./hooks/use-${name}"

// Schemas
// export {} from "./schemas/${name}.schema"
// export type {} from "./schemas/${name}.schema"

// Types
// export type {} from "./types/${name}.types"
`,

}

// ─── Run ─────────────────────────────────────────────────────────────────────

console.log(`\n🚀  Creating feature: ${name}\n`)

const cwd = process.cwd()

for (const [filePath, content] of Object.entries(files)) {
    writeFile(path.join(cwd, filePath), content)
}

// Create components folder with a .gitkeep so it's tracked by git
const componentsDir = path.join(cwd, base, "components")
const gitkeep = path.join(componentsDir, ".gitkeep")
fs.mkdirSync(componentsDir, { recursive: true })
if (!fs.existsSync(gitkeep)) {
    fs.writeFileSync(gitkeep, "", "utf8")
    console.log(`  ✅  Created: ${base}/components/.gitkeep`)
}

console.log(`
✨  Feature "${name}" scaffolded at features/${name}/

  features/${name}/
  ├── components/        ← add UI components here
  ├── hooks/
  │   └── use-${name}.ts
  ├── services/
  │   └── ${name}.service.ts
  ├── schemas/
  │   └── ${name}.schema.ts
  ├── types/
  │   └── ${name}.types.ts
  └── index.ts           ← uncomment exports as you build

Next: open features/${name}/index.ts and start building!
`)