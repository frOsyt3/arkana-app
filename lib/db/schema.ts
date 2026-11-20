import {
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
