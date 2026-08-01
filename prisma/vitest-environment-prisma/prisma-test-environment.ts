import "dotenv/config"

import { execSync } from "node:child_process"
import { randomUUID } from "node:crypto"

import { PrismaPg } from "@prisma/adapter-pg"
import type { Environment } from "vitest/environments"

import { PrismaClient } from "../../src/generated/client.js"

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL environment variable.")
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set("schema", schema)

  return url.toString()
}

export default {
  name: "prisma",
  viteEnvironment: "ssr",
  setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL

    execSync("npx prisma migrate deploy")

    return {
      async teardown() {
        const prisma = new PrismaClient({
          adapter: new PrismaPg({ connectionString: databaseURL }),
        })

        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
} satisfies Environment
