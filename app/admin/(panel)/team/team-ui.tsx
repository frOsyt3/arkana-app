"use client"

import { useActionState, useState, useTransition } from "react"
import { Check, ChevronDown, Copy, KeyRound, Loader2, Trash2 } from "lucide-react"
import { Field, FormMessage, SubmitButton, inputClass, type FormState } from "@/components/admin/form"
import { addMember, changeOwnPassword, changeRole, removeMember, resetMemberPassword, type TeamFormState } from "./actions"

export const ROLE_INFO: Record<string, string> = {
  owner: "Everything, including other owners",
  admin: "Everything except managing owners",
  editor: "Insights, projects, and careers",
  sales: "Leads, consultations, and campaigns",
}

function PasswordReveal({ state }: { state: TeamFormState }) {
  const [copied, setCopied] = useState(false)
  if (!state.password) return null
  const text = `Admin Arkana\nhttps://arkanacorp.id/admin\nEmail: ${state.email}\nPassword: ${state.password}`
  return (
    <div className="space-y-2 rounded-[10px] border border-amber-200 bg-amber-50 p-3 text-[13px]">
      <p className="font-bold text-amber-800">Shown only once. Send it privately, then ask them to change it in My account.</p>
      <code className="block rounded-md bg-white px-3 py-2 font-mono text-[13px] text-[#1F3442]">{state.password}</code>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(text)
          setCopied(true)
        }}
        className="inline-flex items-center gap-1.5 font-bold text-amber-800"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied sign in details" : "Copy sign in details"}
      </button>
    </div>
  )
}

export function AddMemberForm({ canAddOwner }: { canAddOwner: boolean }) {
  const [state, action] = useActionState<TeamFormState, FormData>(addMember, {})
  return (
    <form action={action} className="grid gap-4 p-6">
      <Field label="Name">
        <input name="name" required className={inputClass} />
      </Field>
      <Field label="Work email">
        <input name="email" type="email" required placeholder="nama@arkanacorp.id" className={inputClass} />
      </Field>
      <Field label="Role">
        <select name="role" defaultValue="editor" className={inputClass}>
          {Object.entries(ROLE_INFO)
            .filter(([r]) => canAddOwner || r !== "owner")
            .map(([r, info]) => (
              <option key={r} value={r}>
                {r[0].toUpperCase() + r.slice(1)}: {info}
              </option>
            ))}
        </select>
      </Field>
      <SubmitButton>Add member</SubmitButton>
      <FormMessage state={state} />
      <PasswordReveal state={state} />
    </form>
  )
}

export function RoleSelect({ id, role, canAssignOwner, disabled }: { id: string; role: string; canAssignOwner: boolean; disabled?: boolean }) {
  const [pending, start] = useTransition()
  return (
    <form action={(fd) => start(() => changeRole(fd))} onChange={(e) => e.currentTarget.requestSubmit()} className="relative w-32">
      <input type="hidden" name="id" value={id} />
      <select
        name="role"
        defaultValue={role}
        disabled={disabled || pending}
        aria-label="Role"
        className="w-full appearance-none rounded-[9px] border border-[#E7ECEF] bg-white py-1.5 pl-3 pr-8 text-[13px] font-bold capitalize outline-none focus:border-primary disabled:bg-[#F5F7F8] disabled:text-[#8A9AA6]"
      >
        {Object.keys(ROLE_INFO)
          .filter((r) => canAssignOwner || r !== "owner" || role === "owner")
          .map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
      </select>
      {pending ? (
        <Loader2 className="pointer-events-none absolute right-2.5 top-2 h-4 w-4 animate-spin text-[#8A9AA6]" />
      ) : (
        <ChevronDown className="pointer-events-none absolute right-2.5 top-2 h-4 w-4 text-[#8A9AA6]" />
      )}
    </form>
  )
}

export function MemberActions({ id, name }: { id: string; name: string }) {
  const [state, action, pending] = useActionState<TeamFormState, FormData>(resetMemberPassword, {})
  return (
    <div className="space-y-2">
      <div className="flex justify-end gap-1">
        <form
          action={action}
          onSubmit={(e) => {
            if (!confirm(`Reset the password of ${name}? Their current password stops working.`)) e.preventDefault()
          }}
        >
          <input type="hidden" name="id" value={id} />
          <button title="Reset password" aria-label="Reset password" className="rounded-md p-1.5 text-[#8A9AA6] transition hover:bg-[#F0F4F6] hover:text-[#1F3442]">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          </button>
        </form>
        <form
          action={removeMember}
          onSubmit={(e) => {
            if (!confirm(`Remove ${name} from the admin? They will be signed out and cannot sign in again.`)) e.preventDefault()
          }}
        >
          <input type="hidden" name="id" value={id} />
          <button title="Remove member" aria-label="Remove member" className="rounded-md p-1.5 text-[#8A9AA6] transition hover:bg-red-50 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </form>
      </div>
      {state.error && <p className="text-right text-xs text-red-600">{state.error}</p>}
      <PasswordReveal state={state} />
    </div>
  )
}

export function OwnPasswordForm() {
  const [state, action] = useActionState<FormState, FormData>(changeOwnPassword, {})
  return (
    <form action={action} className="grid gap-4 p-6">
      <Field label="Current password">
        <input name="current" type="password" required autoComplete="current-password" className={inputClass} />
      </Field>
      <Field label="New password" hint="At least 10 characters.">
        <input name="next" type="password" required minLength={10} autoComplete="new-password" className={inputClass} />
      </Field>
      <Field label="Repeat new password">
        <input name="confirm" type="password" required minLength={10} autoComplete="new-password" className={inputClass} />
      </Field>
      <SubmitButton>Change password</SubmitButton>
      <FormMessage state={state} />
    </form>
  )
}
