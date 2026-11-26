import { WhatsAppIcon } from "@/components/whatsapp-icon"

/** Floating WhatsApp chat button shown on every public page. */
export function WhatsAppButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat dengan kami di WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] p-4 text-white shadow-lg transition hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 sm:bottom-8 sm:right-8 sm:px-5"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden text-sm font-bold sm:inline">Chat WhatsApp</span>
    </a>
  )
}
