import { requireArea } from "@/lib/admin/access"
import { notFound } from "next/navigation"
import { articleCategories, getArticleForEdit } from "@/lib/articles"
import { listTeam } from "@/lib/admin/queries"
import { AdminTopbar } from "@/components/admin/page-header"
import { ArticleEditor } from "@/components/admin/article-editor"

export const metadata = { title: "Edit article" }

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  await requireArea("content")
  const { id } = await params
  const [article, team, categories] = await Promise.all([getArticleForEdit(id), listTeam(), articleCategories()])
  if (!article) notFound()

  return (
    <>
      <AdminTopbar crumb="Insights" />
      <ArticleEditor
        team={team}
        categories={categories}
        article={{
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          coverUrl: article.coverUrl,
          category: article.category,
          tags: article.tags,
          authorId: article.authorId,
          status: article.status,
          publishedAt: article.publishedAt?.toISOString() ?? null,
          metaTitle: article.metaTitle ?? "",
          metaDescription: article.metaDescription ?? "",
          updatedAt: article.updatedAt.toISOString(),
        }}
      />
    </>
  )
}
