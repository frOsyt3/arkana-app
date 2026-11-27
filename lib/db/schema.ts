import {
  bigint,
  boolean,
  date,
  index,
  integer,
  jsonb,
  primaryKey,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

export const userRole = pgEnum("user_role", ["owner", "admin", "editor", "sales"])

export const leadStatus = pgEnum("lead_status", [
  "new",
  "contacted",
  "proposal",
  "won",
  "lost",
])

export const activityType = pgEnum("activity_type", [
  "created",
  "status_change",
  "owner_change",
  "note",
])

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
})

export const sessions = pgTable(
  "sessions",
  {
    /** SHA-256 of the cookie token, so a leaked table cannot be replayed. */
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)]
)

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    company: text("company"),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    status: leadStatus("status").notNull().default("new"),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
    /** Channel derived from UTM and referrer, e.g. "Google search" or "Meta Ads". */
    source: text("source").notNull().default("Direct"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmTerm: text("utm_term"),
    utmContent: text("utm_content"),
    referrer: text("referrer"),
    landingPage: text("landing_page"),
    device: text("device"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("leads_created_idx").on(t.createdAt),
    index("leads_status_idx").on(t.status),
  ]
)

export const leadActivities = pgTable(
  "lead_activities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    type: activityType("type").notNull(),
    body: text("body"),
    meta: jsonb("meta").$type<Record<string, string | null>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("lead_activities_lead_idx").on(t.leadId, t.createdAt)]
)

export const articleStatus = pgEnum("article_status", ["draft", "scheduled", "published"])

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull().default(""),
    excerpt: text("excerpt").notNull().default(""),
    /** Rich text from the editor, stored as HTML and sanitised again on render. */
    content: text("content").notNull().default(""),
    coverUrl: text("cover_url"),
    category: text("category").notNull().default("General"),
    tags: text("tags").array().notNull().default([]),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    status: articleStatus("status").notNull().default("draft"),
    /** Go live time. A scheduled article becomes public once this has passed. */
    publishedAt: timestamp("published_at", { withTimezone: true }),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    readingMinutes: integer("reading_minutes").notNull().default(1),
    views: integer("views").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("articles_status_published_idx").on(t.status, t.publishedAt)]
)

export const articleViews = pgTable(
  "article_views",
  {
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    day: date("day").notNull(),
    count: integer("count").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.day] })]
)

/**
 * Daily page view counts for the public site. `visitors` counts a browser once
 * per day, on the first page it opens, so summing it gives unique daily visitors.
 */
export const pageViews = pgTable(
  "page_views",
  {
    day: date("day").notNull(),
    path: text("path").notNull(),
    views: integer("views").notNull().default(0),
    visitors: integer("visitors").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.day, t.path] })]
)

/** Uploaded images, kept in Postgres as base64 so no extra storage service is needed. */
export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  mime: text("mime").notNull(),
  data: text("data").notNull(),
  size: integer("size").notNull(),
  width: integer("width"),
  height: integer("height"),
  uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Article = typeof articles.$inferSelect
export type ArticleStatus = (typeof articleStatus.enumValues)[number]
export type User = typeof users.$inferSelect
export type Lead = typeof leads.$inferSelect
export type LeadActivity = typeof leadActivities.$inferSelect
export type LeadStatus = (typeof leadStatus.enumValues)[number]

/** Portfolio entries shown on /projects. */
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    category: text("category").notNull().default("Website Perusahaan"),
    description: text("description").notNull().default(""),
    sector: text("sector").notNull().default(""),
    year: text("year").notNull().default(""),
    scope: text("scope").notNull().default(""),
    tech: text("tech").array().notNull().default([]),
    imageUrl: text("image_url"),
    domain: text("domain"),
    url: text("url"),
    featured: boolean("featured").notNull().default(false),
    published: boolean("published").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("projects_order_idx").on(t.sortOrder)]
)

export const jobStatus = pgEnum("job_status", ["draft", "open", "closed"])

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  department: text("department").notNull().default(""),
  location: text("location").notNull().default("Bandung"),
  employmentType: text("employment_type").notNull().default("Penuh waktu"),
  workMode: text("work_mode").notNull().default("Di kantor"),
  summary: text("summary").notNull().default(""),
  responsibilities: text("responsibilities").notNull().default(""),
  requirements: text("requirements").notNull().default(""),
  status: jobStatus("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const applicationStatus = pgEnum("application_status", [
  "new",
  "review",
  "interview",
  "offer",
  "hired",
  "rejected",
])

/** CVs live here, not in media, so they are never served by the public /media route. */
export const jobApplications = pgTable(
  "job_applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id").references(() => jobs.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    portfolioUrl: text("portfolio_url"),
    coverLetter: text("cover_letter"),
    cvName: text("cv_name").notNull(),
    cvMime: text("cv_mime").notNull(),
    cvData: text("cv_data").notNull(),
    cvSize: integer("cv_size").notNull(),
    status: applicationStatus("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("job_applications_created_idx").on(t.createdAt)]
)

export const consultationStatus = pgEnum("consultation_status", [
  "requested",
  "confirmed",
  "done",
  "cancelled",
])

export const consultations = pgTable(
  "consultations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    company: text("company"),
    topic: text("topic").notNull(),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
    durationMinutes: integer("duration_minutes").notNull().default(60),
    mode: text("mode").notNull().default("online"),
    location: text("location"),
    notes: text("notes"),
    status: consultationStatus("status").notNull().default("requested"),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("consultations_scheduled_idx").on(t.scheduledAt)]
)

export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  channel: text("channel").notNull(),
  utmSource: text("utm_source").notNull(),
  utmMedium: text("utm_medium").notNull(),
  /** Matched against leads.utm_campaign to count leads. */
  utmCampaign: text("utm_campaign").notNull().unique(),
  landingPath: text("landing_path").notNull().default("/"),
  spend: bigint("spend", { mode: "number" }).notNull().default(0),
  startDate: date("start_date"),
  endDate: date("end_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

/** Editable site wide values, such as contact details, keyed by group name. */
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<Record<string, unknown>>().notNull(),
  updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entity: text("entity").notNull(),
    entityId: text("entity_id"),
    summary: text("summary").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("audit_logs_created_idx").on(t.createdAt)]
)

export type ProjectRow = typeof projects.$inferSelect
export type Job = typeof jobs.$inferSelect
export type JobStatus = (typeof jobStatus.enumValues)[number]
export type ApplicationStatus = (typeof applicationStatus.enumValues)[number]
export type Consultation = typeof consultations.$inferSelect
export type ConsultationStatus = (typeof consultationStatus.enumValues)[number]
export type Campaign = typeof campaigns.$inferSelect
export type UserRole = (typeof userRole.enumValues)[number]
