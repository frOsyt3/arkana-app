/**
 * Creates (or resets) an admin account.
 *
 *   npm run admin:create -- you@arkanacorp.id "Your Name" [owner|admin|editor|sales]
 *
 * A random password is printed once. Sign in with it, then keep it in a password manager.
 */
import { config } from "dotenv"
import { randomBytes } from "node:crypto"
import bcrypt from "bcryptjs"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "../lib/db/schema"

config({ path: ".env.local" })

async function main() {
  const [emailArg, nameArg, roleArg = "owner"] = process.argv.slice(2)
  const roles = ["owner", "admin", "editor", "sales"] as const
  type Role = (typeof roles)[number]

  if (!emailArg || !nameArg || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailArg)) {
    console.error('Usage: npm run admin:create -- you@arkanacorp.id "Your Name" [role]')
    process.exit(1)
  }
  if (!(roles as readonly string[]).includes(roleArg)) {
    console.error(`Role must be one of: ${roles.join(", ")}`)
    process.exit(1)
  }
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing. Add your Neon connection string to .env.local first.")
    process.exit(1)
  }

  const db = drizzle(neon(process.env.DATABASE_URL), { schema })
  const email = emailArg.toLowerCase()
  const password = randomBytes(12).toString("base64url")
  const passwordHash = await bcrypt.hash(password, 12)

  await db
    .insert(schema.users)
    .values({ email, name: nameArg, passwordHash, role: roleArg as Role })
    .onConflictDoUpdate({ target: schema.users.email, set: { name: nameArg, passwordHash, role: roleArg as Role } })

  console.log("")
  console.log(`  Admin ready: ${email} (${roleArg})`)
  console.log(`  Password:    ${password}`)
  console.log("")
  console.log("  This password is shown only once. Sign in at /admin/login.")
  console.log("")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
