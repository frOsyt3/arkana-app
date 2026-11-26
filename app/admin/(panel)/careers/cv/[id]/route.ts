import { eq } from "drizzle-orm"
import { getCurrentUser } from "@/lib/auth"
import { canAccess } from "@/lib/admin/access"
import { getDb, schema } from "@/lib/db"

/** CV download for signed in staff only. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || !canAccess(user.role, "careers")) return new Response("Not found", { status: 404 })
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Not found", { status: 404 })

  const [row] = await getDb()
    .select({ name: schema.jobApplications.cvName, mime: schema.jobApplications.cvMime, data: schema.jobApplications.cvData })
    .from(schema.jobApplications)
    .where(eq(schema.jobApplications.id, id))
    .limit(1)
  if (!row) return new Response("Not found", { status: 404 })

  return new Response(Buffer.from(row.data, "base64"), {
    headers: {
      "Content-Type": row.mime,
      "Content-Disposition": `inline; filename="${row.name.replace(/[^\w.\- ]/g, "_")}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
