"use client"

import { useActionState } from "react"
import { CheckCircle2, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { submitApplication, type ApplyState } from "@/app/(site)/careers/actions"

const inputClass =
  "w-full px-4 py-3 rounded-lg border-2 border-border hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 placeholder:text-gray-500 bg-white"

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-secondary">
        {label}
        {required && " *"}
      </span>
      {children}
      {error && <span className="block text-sm text-red-600">{error}</span>}
    </label>
  )
}

export function ApplyForm({ jobId, position }: { jobId?: string; position: string }) {
  const [state, action, pending] = useActionState<ApplyState, FormData>(submitApplication, { status: "idle" })
  const err = state.fieldErrors ?? {}

  if (state.status === "success")
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-7 w-7 text-primary" />
        </span>
        <h3 className="text-2xl font-bold text-secondary">Lamaran Anda sudah kami terima</h3>
        <p className="max-w-md text-gray-600">
          Terima kasih sudah melamar sebagai {position}. Tim kami akan meninjau CV Anda dan menghubungi kandidat yang sesuai.
        </p>
      </div>
    )

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      )}
      <input type="hidden" name="jobId" value={jobId ?? ""} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama lengkap" error={err.name} required>
          <input name="name" autoComplete="name" className={cn(inputClass, err.name && "border-red-400")} />
        </Field>
        <Field label="Email" error={err.email} required>
          <input name="email" type="email" autoComplete="email" className={cn(inputClass, err.email && "border-red-400")} />
        </Field>
        <Field label="Nomor WhatsApp" error={err.phone} required>
          <input name="phone" type="tel" autoComplete="tel" placeholder="+62 812 3456 7890" className={cn(inputClass, err.phone && "border-red-400")} />
        </Field>
        <Field label="Portofolio atau LinkedIn" error={err.portfolioUrl}>
          <input name="portfolioUrl" type="url" placeholder="https://" className={cn(inputClass, err.portfolioUrl && "border-red-400")} />
        </Field>
      </div>
      <Field label="CV (PDF, DOC, atau DOCX, maksimal 2 MB)" error={err.cv} required>
        <input
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className={cn(
            inputClass,
            "file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary",
            err.cv && "border-red-400"
          )}
        />
      </Field>
      <Field label="Ceritakan singkat tentang diri Anda" error={err.coverLetter}>
        <textarea name="coverLetter" rows={5} maxLength={3000} className={cn(inputClass, "resize-none")} />
      </Field>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <p className="text-xs text-gray-500">Data Anda hanya digunakan untuk proses rekrutmen di PT. Arkana Tunas Persada.</p>
      <Button size="lg" className="group w-full" disabled={pending}>
        {pending ? (
          <>
            Mengirim <Loader2 className="ml-2 h-5 w-5 animate-spin" />
          </>
        ) : (
          <>
            Kirim Lamaran <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </form>
  )
}
