export const projectCategories = [
  "Website Perusahaan",
  "Aplikasi Web",
  "Dashboard",
  "Portal Pemerintah",
] as const

export type ProjectCategory = (typeof projectCategories)[number]

/** Drawn preview used when a project has no screenshot yet. */
export type ProjectThumbnail = "dashboard" | "portal" | "table"

export interface Project {
  slug: string
  title: string
  /** One of projectCategories, or a custom label typed in the admin. */
  category: string
  description: string
  sector: string
  year: string
  scope: string
  tech: string[]
  /** Screenshot in /public, shown inside a browser frame. */
  image?: string
  /** Address shown in the browser frame, e.g. "arkanacorp.id". */
  domain?: string
  /** Live site. When set, the card links to it. */
  url?: string
  thumbnail?: ProjectThumbnail
  featured?: boolean
}

/** Fallback list used only when the database is not configured. Edit projects in Admin, Projects. */
export const projects: Project[] = [
  {
    slug: "arkana-corporate-website",
    title: "Arkana Corporate Website",
    category: "Website Perusahaan",
    description:
      "Website korporat yang menempatkan Arkana sebagai mitra solusi IT dan pengadaan, dengan halaman layanan yang jelas, kredensial pengadaan, dan company profile yang dapat diunduh.",
    sector: "Korporat, layanan IT",
    year: "2026",
    scope: "Desain, pengembangan, peluncuran",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    image: "/images/projects/arkana-corporate-website.png",
    domain: "arkanacorp.id",
    featured: true,
  },
  {
    slug: "qira-store",
    title: "Qira Store",
    category: "Aplikasi Web",
    description:
      "Aplikasi trade in HP bekas dengan estimasi harga instan, akun penjual, dan dashboard admin untuk mengelola katalog, aturan harga, serta pengajuan penjualan.",
    sector: "Ritel, elektronik konsumen",
    year: "2026",
    scope: "Desain UX, pengembangan full stack, peluncuran",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Supabase", "Vercel"],
    image: "/images/projects/qira-store.png",
    domain: "qira-store.vercel.app",
    url: "https://qira-store.vercel.app",
    featured: true,
  },
  {
    slug: "martensite-workwear",
    title: "Martensite Workwear",
    category: "Website Perusahaan",
    description:
      "Website company profile untuk workshop produksi celana yang melayani brand lokal dengan minimum order 24 pcs, menampilkan layanan, arsip produk, klien, dan jalur kontak untuk pemesanan.",
    sector: "Fashion, produksi garmen",
    year: "2026",
    scope: "Desain, pengembangan, peluncuran",
    tech: ["Next.js", "Tailwind CSS", "Vercel"],
    image: "/images/projects/martensite-workwear.png",
    domain: "martensiteworkwear.com",
    url: "https://martensiteworkwear.com",
    featured: true,
  },
]
