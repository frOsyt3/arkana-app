import type { Metadata } from "next"

export const metadata: Metadata = {
  title: { default: "Admin | Arkana", template: "%s | Arkana Admin" },
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#F5F7F8] text-[#1F3442]">{children}</div>
}
