import "server-only"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL)
}

function createDb() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error("DATABASE_URL is not set. Add your Neon connection string to .env.local.")
  }
  return drizzle(neon(url), { schema })
}

let instance: ReturnType<typeof createDb> | undefined

/** Lazily created so pages that never touch the database still build without DATABASE_URL. */
export function getDb() {
  instance ??= createDb()
  return instance
}

export { schema }
