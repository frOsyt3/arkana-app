export const projectCategories = [
  "Company Website",
  "Web Application",
  "Dashboard",
  "Government Portal",
] as const

export type ProjectCategory = (typeof projectCategories)[number]

/** Drawn preview used when a project has no screenshot yet. */
export type ProjectThumbnail = "dashboard" | "portal" | "table"

export interface Project {
  slug: string
  title: string
  category: ProjectCategory
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

export const projects: Project[] = [
  {
    slug: "arkana-corporate-website",
    title: "Arkana Corporate Website",
    category: "Company Website",
    description:
      "A corporate website that positions Arkana as an IT solutions and procurement partner, with clear service pages, procurement credentials, and a downloadable company profile.",
    sector: "Corporate, IT services",
    year: "2026",
    scope: "Design, development, launch",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    image: "/images/projects/arkana-corporate-website.png",
    domain: "arkanacorp.id",
    featured: true,
  },
  {
    slug: "qira-store",
    title: "Qira Store",
    category: "Web Application",
    description:
      "A used phone trade in app with instant price estimates, seller accounts, and an admin dashboard for the catalog, pricing rules, and submissions.",
    sector: "Retail, consumer electronics",
    year: "2026",
    scope: "UX design, full stack development, launch",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Supabase", "Vercel"],
    image: "/images/projects/qira-store.png",
    domain: "qira-store.vercel.app",
    url: "https://qira-store.vercel.app",
    featured: true,
  },
]
