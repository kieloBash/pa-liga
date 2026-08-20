import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
    adapter,
});

async function main() {
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    const name = process.env.ADMIN_NAME ?? "Admin"

    if (!email || !password) {
        throw new Error(
            "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local to run the seed."
        )
    }

    console.log(`🌱 Seeding admin user: ${email}`)

    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            name,
            password: hashedPassword,
        },
        create: {
            email,
            name,
            password: hashedPassword,
            role: "ADMIN",
        },
    })

    console.log(`✅ Admin user seeded successfully (id: ${user.id})`)
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })