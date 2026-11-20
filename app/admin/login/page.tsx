import { redirect } from "next/navigation"
import { isDatabaseConfigured } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { SetupNotice } from "@/components/admin/setup-notice"
import { LoginForm } from "./login-form"

export const metadata = { title: "Sign in" }
export const dynamic = "force-dynamic"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  if (!isDatabaseConfigured()) return <SetupNotice />
  if (await getCurrentUser()) redirect("/admin")
  const { next } = await searchParams

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-secondary-dark to-secondary lg:block">
        <div className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-primary/15" />
        <div className="absolute -bottom-40 -left-20 h-[520px] w-[520px] rounded-full bg-primary/10" />
        <div className="relative flex h-full flex-col justify-between p-14 text-white">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/arkana-mark.svg" alt="" className="h-9 w-auto" />
            <span className="text-lg font-bold">Arkana</span>
          </div>
          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight">Every lead, campaign, and page in one place.</h1>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Follow up enquiries quickly, see which channels bring customers, and keep the website up to date.
            </p>
          </div>
          <p className="text-sm text-white/50">PT. Arkana Tunas Persada</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/arkana-mark.svg" alt="" className="h-8 w-auto" />
            <span className="text-lg font-bold">Arkana</span>
          </div>
          <h2 className="text-2xl font-bold">Sign in to the admin console</h2>
          <p className="mt-2 text-[#6B7C88]">Use the account your administrator created for you.</p>
          <LoginForm next={next} />
        </div>
      </div>
    </div>
  )
}
