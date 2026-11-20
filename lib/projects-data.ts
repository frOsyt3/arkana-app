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
  /** Example content from the mockup. Replace with a real project before launch. */
  isExample?: boolean
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
    slug: "government-procurement-dashboard",
    title: "Government Procurement Dashboard",
    category: "Dashboard",
    description:
      "Real time monitoring of tenders, budgets, and vendor performance for a regional agency.",
    sector: "Government",
    year: "2025",
    scope: "Design, development",
    tech: ["Laravel", "Vue", "PostgreSQL"],
    thumbnail: "dashboard",
    isExample: true,
  },
  {
    slug: "public-service-information-portal",
    title: "Public Service Information Portal",
    category: "Government Portal",
    description:
      "A citizen facing portal for announcements, service requests, and open data publication.",
    sector: "Government",
    year: "2025",
    scope: "Design, development, launch",
    tech: ["Next.js", "Node.js", "MySQL"],
    thumbnail: "portal",
    isExample: true,
  },
  {
    slug: "inventory-asset-management-system",
    title: "Inventory and Asset Management System",
    category: "Web Application",
    description:
      "Tracks IT assets across offices, with procurement records, maintenance schedules, and reports.",
    sector: "Enterprise",
    year: "2024",
    scope: "Development, maintenance",
    tech: ["React", "Laravel", "MySQL"],
    thumbnail: "table",
    isExample: true,
  },
]
