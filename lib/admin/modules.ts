import {
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  Inbox,
  LayoutDashboard,
  Megaphone,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react"

export interface AdminModule {
  slug: string
  href: string
  label: string
  icon: LucideIcon
  group: "Main" | "Content" | "Growth" | "System"
  ready: boolean
  summary: string
}

export const adminModules: AdminModule[] = [
  { slug: "", href: "/admin", label: "Overview", icon: LayoutDashboard, group: "Main", ready: true, summary: "" },
  { slug: "leads", href: "/admin/leads", label: "Leads", icon: Inbox, group: "Main", ready: true, summary: "" },
  {
    slug: "consultations",
    href: "/admin/consultations",
    label: "Consultations",
    icon: CalendarDays,
    group: "Main",
    ready: false,
    summary: "Requests from Schedule a Consultation in a calendar view, with confirm, reschedule, and done states.",
  },
  {
    slug: "insights",
    href: "/admin/insights",
    label: "Insights",
    icon: FileText,
    group: "Content",
    ready: false,
    summary: "Write articles with a rich text editor, cover image, category, and SEO fields, then publish or schedule them.",
  },
  {
    slug: "projects",
    href: "/admin/projects",
    label: "Projects",
    icon: BriefcaseBusiness,
    group: "Content",
    ready: false,
    summary: "Add portfolio entries with screenshots, category, featured toggle, and display order without touching code.",
  },
  {
    slug: "careers",
    href: "/admin/careers",
    label: "Careers",
    icon: Users,
    group: "Content",
    ready: false,
    summary: "Publish job openings and review applicants with CV download and hiring status.",
  },
  {
    slug: "traffic",
    href: "/admin/traffic",
    label: "Traffic & SEO",
    icon: TrendingUp,
    group: "Growth",
    ready: false,
    summary: "Visitors by page, city, device, and channel from Google Analytics, plus keywords and rankings from Search Console.",
  },
  {
    slug: "campaigns",
    href: "/admin/campaigns",
    label: "Campaigns",
    icon: Megaphone,
    group: "Growth",
    ready: false,
    summary: "UTM link builder for Meta Ads and LinkedIn, ad spend, and leads and cost per lead for each campaign.",
  },
  {
    slug: "settings",
    href: "/admin/settings",
    label: "Company settings",
    icon: SlidersHorizontal,
    group: "System",
    ready: false,
    summary: "Contact details, phone visibility, business hours, social links, and the company profile PDF.",
  },
  {
    slug: "team",
    href: "/admin/team",
    label: "Team & access",
    icon: ShieldCheck,
    group: "System",
    ready: false,
    summary: "Invite team members as Owner, Admin, Editor, or Sales, with an audit log of every change.",
  },
]

export const moduleGroups = ["Main", "Content", "Growth", "System"] as const
