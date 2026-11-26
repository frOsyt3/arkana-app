import { asc, desc, eq } from "drizzle-orm"
import { requireUser } from "@/lib/auth"
import { canAccess } from "@/lib/admin/access"
import { getDb, schema } from "@/lib/db"
import { avatarTone, formatDateTime, formatRelative } from "@/lib/admin/format"
import { AdminTopbar, PageTitle, Panel } from "@/components/admin/page-header"
import { AddMemberForm, MemberActions, OwnPasswordForm, ROLE_INFO, RoleSelect } from "./team-ui"
import { cn } from "@/lib/utils"

export const metadata = { title: "Team & access" }

const { users, auditLogs } = schema

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export default async function TeamPage() {
  const me = await requireUser()
  const manage = canAccess(me.role, "team")
  const db = getDb()
  const [members, logs] = manage
    ? await Promise.all([
        db
          .select({ id: users.id, name: users.name, email: users.email, role: users.role, lastLoginAt: users.lastLoginAt })
          .from(users)
          .orderBy(asc(users.createdAt)),
        db
          .select({ id: auditLogs.id, summary: auditLogs.summary, entity: auditLogs.entity, createdAt: auditLogs.createdAt, who: users.name })
          .from(auditLogs)
          .leftJoin(users, eq(auditLogs.userId, users.id))
          .orderBy(desc(auditLogs.createdAt))
          .limit(50),
      ])
    : [[], []]
  const owners = members.filter((m) => m.role === "owner").length

  return (
    <>
      <AdminTopbar crumb="Team & access" />
      <div className="space-y-5 px-6 py-8 lg:px-8">
        <PageTitle
          title="Team & access"
          description={manage ? "Who can sign in to the admin, what each person can do, and a log of changes." : "Your account and password."}
        />

        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            {manage && (
              <Panel title="Members" description={`${members.length} people can sign in.`}>
                <ul className="mt-4 divide-y divide-[#F1F4F6] border-t border-[#EEF2F4]">
                  {members.map((m) => {
                    const isMe = m.id === me.id
                    const locked = isMe || (m.role === "owner" && me.role !== "owner")
                    const lastOwner = m.role === "owner" && owners <= 1
                    return (
                      <li key={m.id} className="grid items-start gap-3 px-6 py-4 sm:grid-cols-[1fr_auto_auto]">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold", avatarTone(m.email))}>
                            {initialsOf(m.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold">
                              {m.name} {isMe && <span className="font-normal text-[#8A9AA6]">(you)</span>}
                            </p>
                            <p className="truncate text-xs text-[#8A9AA6]">
                              {m.email} · {m.lastLoginAt ? `last sign in ${formatRelative(m.lastLoginAt).toLowerCase()}` : "never signed in"}
                            </p>
                          </div>
                        </div>
                        <RoleSelect id={m.id} role={m.role} canAssignOwner={me.role === "owner"} disabled={locked || lastOwner} />
                        {locked || lastOwner ? <span className="w-[68px]" /> : <MemberActions id={m.id} name={m.name} />}
                      </li>
                    )
                  })}
                </ul>
              </Panel>
            )}

            {manage && (
              <Panel title="Activity log" description="The latest 50 changes made in the admin.">
                <ul className="mt-4 divide-y divide-[#F1F4F6] border-t border-[#EEF2F4]">
                  {logs.length === 0 && <li className="px-6 py-8 text-center text-sm text-[#8A9AA6]">No changes recorded yet.</li>}
                  {logs.map((l) => (
                    <li key={l.id} className="flex items-start justify-between gap-4 px-6 py-3 text-[13px]">
                      <span>
                        <span className="font-bold">{l.who ?? "Former member"}</span>{" "}
                        <span className="text-[#4B5B66]">{l.summary}</span>
                      </span>
                      <span className="shrink-0 text-xs text-[#8A9AA6]">{formatDateTime(l.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
          </div>

          <div className="space-y-5">
            {manage && (
              <Panel title="Add member" description="They get a one time password to sign in.">
                <AddMemberForm canAddOwner={me.role === "owner"} />
              </Panel>
            )}
            <Panel title="My account" description={`${me.email}, ${me.role}.`}>
              <OwnPasswordForm />
            </Panel>
            <Panel title="What each role can do">
              <dl className="space-y-2.5 p-6 text-[13px]">
                {Object.entries(ROLE_INFO).map(([role, info]) => (
                  <div key={role} className="grid grid-cols-[64px_1fr] gap-2">
                    <dt className="font-bold capitalize">{role}</dt>
                    <dd className="text-[#6B7C88]">{info}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          </div>
        </div>
      </div>
    </>
  )
}
