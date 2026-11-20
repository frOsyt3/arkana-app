import type { MetadataRoute } from "next"
import { sitemapArticles } from "@/lib/articles"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arkanacorp.id"
  const pages = ["", "/about", "/projects", "/insight", "/careers", "/contact"].map((path) => ({
    url: `${site}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }))
  let articles: MetadataRoute.Sitemap = []
  try {
    articles = (await sitemapArticles()).map((a) => ({
      url: `${site}/insight/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error("Sitemap could not load articles", error)
  }
  return [...pages, ...articles]
}
