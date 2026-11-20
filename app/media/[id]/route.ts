import { eq } from "drizzle-orm"
import { getDb, isDatabaseConfigured, schema } from "@/lib/db"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isDatabaseConfigured() || !/^[0-9a-f-]{36}$/i.test(id)) return new Response("Not found", { status: 404 })

  const [row] = await getDb()
    .select({ mime: schema.media.mime, data: schema.media.data })
    .from(schema.media)
    .where(eq(schema.media.id, id))
    .limit(1)
  if (!row) return new Response("Not found", { status: 404 })

  return new Response(Buffer.from(row.data, "base64"), {
    headers: {
      "Content-Type": row.mime,
      // Uploads never change once stored, so browsers and the CDN can keep them for a year.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
