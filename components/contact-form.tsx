"use client"

import { useActionState, useEffect, useState } from "react"
import { CheckCircle2, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { submitLead, type ContactFormState } from "@/app/(site)/contact/actions"
import { readAttribution, type StoredAttribution } from "@/components/attribution-tracker"

const inputClass =
  "w-full px-4 py-3 rounded-lg border-2 border-border hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder:text-gray-500 bg-white"

const initialState: ContactFormState = { status: "idle" }

function Field({
  label,
  name,
  error,
  required,
  children,
}: {
  label: string
  name: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-secondary">
        {label}
        {required && " *"}
      </label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitLead, initialState)
  const [attribution, setAttribution] = useState<StoredAttribution | null>(null)

  useEffect(() => {
    // localStorage is only readable after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttribution(readAttribution())
  }, [])

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-secondary">Terima kasih, pesan Anda sudah kami terima</h3>
        <p className="max-w-md text-gray-600">
          Tim kami akan meninjau permintaan Anda dan menghubungi Anda dalam satu hari kerja.
        </p>
      </div>
    )
  }

  const err = state.fieldErrors ?? {}
  const a = attribution

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.status === "error" && state.message && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Nama Depan" name="firstName" error={err.firstName} required>
          <input id="firstName" name="firstName" autoComplete="given-name" placeholder="Budi" className={cn(inputClass, err.firstName && "border-red-400")} required />
        </Field>
        <Field label="Nama Belakang" name="lastName" error={err.lastName} required>
          <input id="lastName" name="lastName" autoComplete="family-name" placeholder="Santoso" className={cn(inputClass, err.lastName && "border-red-400")} required />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Email" name="email" error={err.email} required>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="budi@perusahaan.co.id" className={cn(inputClass, err.email && "border-red-400")} required />
        </Field>
        <Field label="Nomor Telepon" name="phone" error={err.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+62 812 3456 7890" className={inputClass} />
        </Field>
      </div>

      <Field label="Perusahaan atau Instansi" name="company" error={err.company}>
        <input id="company" name="company" autoComplete="organization" placeholder="PT Contoh Indonesia" className={inputClass} />
      </Field>

      <Field label="Subjek" name="subject" error={err.subject} required>
        <input id="subject" name="subject" placeholder="Apa yang bisa kami bantu?" className={cn(inputClass, err.subject && "border-red-400")} required />
      </Field>

      <Field label="Pesan" name="message" error={err.message} required>
        <textarea
          id="message"
          name="message"
          rows={6}
          placeholder="Ceritakan kebutuhan, jadwal, dan perkiraan anggaran Anda bila ada."
          className={cn(inputClass, "resize-none", err.message && "border-red-400")}
          required
        />
      </Field>

      {/* Honeypot for bots, hidden from people and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <input type="hidden" name="utmSource" value={a?.utmSource ?? ""} />
      <input type="hidden" name="utmMedium" value={a?.utmMedium ?? ""} />
      <input type="hidden" name="utmCampaign" value={a?.utmCampaign ?? ""} />
      <input type="hidden" name="utmTerm" value={a?.utmTerm ?? ""} />
      <input type="hidden" name="utmContent" value={a?.utmContent ?? ""} />
      <input type="hidden" name="referrer" value={a?.referrer ?? ""} />
      <input type="hidden" name="landingPage" value={a?.landingPage ?? ""} />

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="privacy"
          className="mt-1 h-4 w-4 cursor-pointer rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0"
          required
        />
        <label htmlFor="privacy" className="cursor-pointer text-sm text-gray-600">
          Saya bersedia dihubungi oleh Arkana terkait permintaan ini
        </label>
      </div>

      <Button size="lg" className="group w-full" disabled={pending}>
        {pending ? (
          <>
            Mengirim
            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
          </>
        ) : (
          <>
            Kirim Pesan
            <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </form>
  )
}
