CREATE TYPE "public"."application_status" AS ENUM('new', 'review', 'interview', 'offer', 'hired', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."consultation_status" AS ENUM('requested', 'confirmed', 'done', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('draft', 'open', 'closed');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text,
	"summary" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"channel" text NOT NULL,
	"utm_source" text NOT NULL,
	"utm_medium" text NOT NULL,
	"utm_campaign" text NOT NULL,
	"landing_path" text DEFAULT '/' NOT NULL,
	"spend" bigint DEFAULT 0 NOT NULL,
	"start_date" date,
	"end_date" date,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "campaigns_utm_campaign_unique" UNIQUE("utm_campaign")
);
--> statement-breakpoint
CREATE TABLE "consultations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"company" text,
	"topic" text NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"duration_minutes" integer DEFAULT 60 NOT NULL,
	"mode" text DEFAULT 'online' NOT NULL,
	"location" text,
	"notes" text,
	"status" "consultation_status" DEFAULT 'requested' NOT NULL,
	"owner_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"portfolio_url" text,
	"cover_letter" text,
	"cv_name" text NOT NULL,
	"cv_mime" text NOT NULL,
	"cv_data" text NOT NULL,
	"cv_size" integer NOT NULL,
	"status" "application_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"department" text DEFAULT '' NOT NULL,
	"location" text DEFAULT 'Bandung' NOT NULL,
	"employment_type" text DEFAULT 'Penuh waktu' NOT NULL,
	"work_mode" text DEFAULT 'Di kantor' NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"responsibilities" text DEFAULT '' NOT NULL,
	"requirements" text DEFAULT '' NOT NULL,
	"status" "job_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "jobs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"category" text DEFAULT 'Website Perusahaan' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"sector" text DEFAULT '' NOT NULL,
	"year" text DEFAULT '' NOT NULL,
	"scope" text DEFAULT '' NOT NULL,
	"tech" text[] DEFAULT '{}' NOT NULL,
	"image_url" text,
	"domain" text,
	"url" text,
	"featured" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_created_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "consultations_scheduled_idx" ON "consultations" USING btree ("scheduled_at");--> statement-breakpoint
CREATE INDEX "job_applications_created_idx" ON "job_applications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "projects_order_idx" ON "projects" USING btree ("sort_order");--> statement-breakpoint
INSERT INTO "projects" ("slug","title","category","description","sector","year","scope","tech","image_url","domain","url","featured","sort_order") VALUES
('arkana-corporate-website','Arkana Corporate Website','Website Perusahaan','Website korporat yang menempatkan Arkana sebagai mitra solusi IT dan pengadaan, dengan halaman layanan yang jelas, kredensial pengadaan, dan company profile yang dapat diunduh.','Korporat, layanan IT','2026','Desain, pengembangan, peluncuran','{"Next.js","Tailwind CSS","Framer Motion"}','/images/projects/arkana-corporate-website.png','arkanacorp.id',NULL,true,1),
('qira-store','Qira Store','Aplikasi Web','Aplikasi trade in HP bekas dengan estimasi harga instan, akun penjual, dan dashboard admin untuk mengelola katalog, aturan harga, serta pengajuan penjualan.','Ritel, elektronik konsumen','2026','Desain UX, pengembangan full stack, peluncuran','{"Next.js","TypeScript","Tailwind CSS","Framer Motion","Supabase","Vercel"}','/images/projects/qira-store.png','qira-store.vercel.app','https://qira-store.vercel.app',true,2),
('martensite-workwear','Martensite Workwear','Website Perusahaan','Website company profile untuk workshop produksi celana yang melayani brand lokal dengan minimum order 24 pcs, menampilkan layanan, arsip produk, klien, dan jalur kontak untuk pemesanan.','Fashion, produksi garmen','2026','Desain, pengembangan, peluncuran','{"Next.js","Tailwind CSS","Vercel"}','/images/projects/martensite-workwear.png','martensiteworkwear.com','https://martensiteworkwear.com',true,3)
ON CONFLICT ("slug") DO NOTHING;
