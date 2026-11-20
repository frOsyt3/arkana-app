"use client"

import { useActionState } from "react"
import { Loader2 } from "lucide-react"
import { login, type LoginState } from "@/app/admin/actions"

const input =
  "mt-2 w-full rounded-[10px] border border-[#E7ECEF] bg-white px-3.5 py-2.5 text-[15px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {})

  return (
    <form action={action} className="mt-8 space-y-5">
      {state.error && (
        <p role="alert" className="rounded-[10px] border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <input type="hidden" name="next" value={next ?? ""} />
      <label className="block text-sm font-semibold">
        Email
        <input name="email" type="email" autoComplete="username" required className={input} />
      </label>
      <label className="block text-sm font-semibold">
        Password
        <input name="password" type="password" autoComplete="current-password" required className={input} />
      </label>
      <button
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-secondary-dark py-3 font-bold text-white transition hover:bg-secondary disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Sign in
      </button>
    </form>
  )
}
