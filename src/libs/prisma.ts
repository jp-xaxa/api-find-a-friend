import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

import { env } from "@/env/index.js"

import { PrismaClient } from "../generated/client.js"

const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

const schema = new URL(env.DATABASE_URL).searchParams.get("schema")

const adapter = new PrismaPg(pool, schema ? { schema } : undefined)

export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === "dev" ? ["query"] : [],
})
