"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { EditorContent, useEditor, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import { TableKit } from "@tiptap/extension-table"
import { CharacterCount, Placeholder } from "@tiptap/extensions"
import {
  ArrowLeft,
  Bold,
  CalendarClock,
  ChevronDown,
  Eye,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Redo2,
  Send,
  Table2,
  Trash2,
  Undo2,
  X,
} from "lucide-react"
import { deleteArticle, saveArticle, uploadImage, type SaveArticleInput } from "@/app/admin/(panel)/insights/actions"
import { ArticleStatusBadge } from "@/components/admin/article-status-badge"
import { resizeImage } from "@/lib/resize-image"
import type { ArticleStatus } from "@/lib/db/schema"
import { cn } from "@/lib/utils"

export interface EditableArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverUrl: string | null
  category: string
  tags: string[]
  authorId: string | null
  status: ArticleStatus
  publishedAt: string | null
  metaTitle: string
  metaDescription: string
  updatedAt: string
}

type Intent = SaveArticleInput["intent"]

const TZ = "Asia/Jakarta"
const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(new Date(iso))
const fmtDateTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))

/** datetime-local works without a zone, so the field is always read and written as WIB. */
const toWibInput = (iso: string | null) =>
  iso ? new Date(new Date(iso).getTime() + 7 * 3600_000).toISOString().slice(0, 16) : ""
const fromWibInput = (value: string) => (value ? new Date(`${value}:00+07:00`).toISOString() : null)

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

const card = "rounded-[14px] border border-[#E7ECEF] bg-white"
const label = "text-xs font-bold text-[#6B7C88]"
const input =
  "w-full rounded-[9px] border border-[#E7ECEF] bg-white px-3 py-2 text-[13px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"

function Counter({ value, min, max }: { value: number; min: number; max: number }) {
  const tone = value === 0 ? "text-[#A3B1BA]" : value < min || value > max ? "text-amber-600" : "text-green-600"
  return (
    <span className={cn("text-xs font-bold", tone)}>
      {value} / {max}
    </span>
  )
}

function ToolButton({
  onClick,
  active,
  label: title,
  children,
  disabled,
}: {
  onClick: () => void
  active?: boolean
  label: string
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "flex h-8 min-w-8 items-center justify-center rounded-[7px] px-2 text-[13px] transition disabled:opacity-40",
        active ? "bg-primary/12 text-[#2F7F81]" : "text-[#4B5B66] hover:bg-white hover:text-[#1F3442]"
      )}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor, onImage, uploading }: { editor: Editor; onImage: () => void; uploading: boolean }) {
  const block = editor.isActive("heading", { level: 2 }) ? "h2" : editor.isActive("heading", { level: 3 }) ? "h3" : "p"
  const sep = <span className="mx-1 h-5 w-px bg-[#E7ECEF]" />

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 rounded-[10px] border border-[#E7ECEF] bg-[#F8FAFB] p-1.5">
      <div className="relative">
        <select
          aria-label="Text style"
          value={block}
          onChange={(e) => {
            const v = e.target.value
            const chain = editor.chain().focus()
            if (v === "p") chain.setParagraph().run()
            else chain.setHeading({ level: v === "h2" ? 2 : 3 }).run()
          }}
          className="h-8 appearance-none rounded-[7px] border border-[#E7ECEF] bg-white pl-2.5 pr-7 text-[13px] outline-none"
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading</option>
          <option value="h3">Subheading</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-[#8A9AA6]" />
      </div>
      {sep}
      <ToolButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </ToolButton>
      {sep}
      <ToolButton label="Bulleted list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </ToolButton>
      {sep}
      <ToolButton
        label="Link"
        active={editor.isActive("link")}
        onClick={() => {
          const previous = editor.getAttributes("link").href as string | undefined
          const url = window.prompt("Link address (leave empty to remove the link)", previous ?? "https://")
          if (url === null) return
          if (url.trim() === "" || url.trim() === "https://") editor.chain().focus().extendMarkRange("link").unsetLink().run()
          else editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run()
        }}
      >
        <Link2 className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Insert image" onClick={onImage} disabled={uploading}>
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
      </ToolButton>
      <ToolButton
        label={editor.isActive("table") ? "Delete table" : "Insert table"}
        active={editor.isActive("table")}
        onClick={() =>
          editor.isActive("table")
            ? editor.chain().focus().deleteTable().run()
            : editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
      >
        <Table2 className="h-4 w-4" />
      </ToolButton>
      {editor.isActive("table") && (
        <>
          <ToolButton label="Add row" onClick={() => editor.chain().focus().addRowAfter().run()}>
            <span className="text-xs font-bold">+ Row</span>
          </ToolButton>
          <ToolButton label="Add column" onClick={() => editor.chain().focus().addColumnAfter().run()}>
            <span className="text-xs font-bold">+ Col</span>
          </ToolButton>
        </>
      )}
      <span className="ml-auto flex">
        <ToolButton label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo2 className="h-4 w-4" />
        </ToolButton>
      </span>
    </div>
  )
}

export function ArticleEditor({
  article,
  team,
  categories,
}: {
  article: EditableArticle
  team: { id: string; name: string }[]
  categories: string[]
}) {
  const [title, setTitle] = useState(article.title)
  const [excerpt, setExcerpt] = useState(article.excerpt)
  const [slug, setSlug] = useState(article.slug)
  const [slugTouched, setSlugTouched] = useState(!article.slug.startsWith("untitled-"))
  const [coverUrl, setCoverUrl] = useState(article.coverUrl)
  const [category, setCategory] = useState(article.category)
  const [tags, setTags] = useState(article.tags)
  const [tagDraft, setTagDraft] = useState("")
  const [authorId, setAuthorId] = useState(article.authorId ?? "")
  const [metaTitle, setMetaTitle] = useState(article.metaTitle)
  const [metaDescription, setMetaDescription] = useState(article.metaDescription)
  const [publishAt, setPublishAt] = useState(article.status === "scheduled" ? toWibInput(article.publishedAt) : "")

  const [status, setStatus] = useState<ArticleStatus>(article.status)
  const [publishedAt, setPublishedAt] = useState(article.publishedAt)
  const [savedAt, setSavedAt] = useState(article.updatedAt)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState<Intent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [uploading, setUploading] = useState<"cover" | "body" | null>(null)

  const version = useRef(0)
  const coverInput = useRef<HTMLInputElement>(null)
  const bodyInput = useRef<HTMLInputElement>(null)

  const touch = useCallback(() => {
    version.current += 1
    setDirty(true)
  }, [])

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Image.configure({ inline: false }),
      TableKit.configure({ table: { resizable: false } }),
      Placeholder.configure({ placeholder: "Start writing. Use the toolbar for headings, lists, links, images, and tables." }),
      CharacterCount,
    ],
    content: article.content,
    editorProps: { attributes: { class: "article-body min-h-[420px] outline-none" } },
    onUpdate: touch,
  })

  const isLive = status === "published" || (status === "scheduled" && !!publishedAt && new Date(publishedAt) <= new Date())
  const effective: ArticleStatus = isLive ? "published" : status
  const futureDate = publishAt && new Date(`${publishAt}:00+07:00`) > new Date()

  const save = useCallback(
    async (intent: Intent) => {
      if (!editor) return false
      const started = version.current
      setSaving(intent)
      setError(null)
      const res = await saveArticle({
        id: article.id,
        intent,
        title,
        slug,
        excerpt,
        content: editor.getHTML(),
        coverUrl,
        category: category.trim() || "General",
        tags,
        authorId: authorId || null,
        metaTitle,
        metaDescription,
        publishAt: fromWibInput(publishAt),
      })
      setSaving(null)
      if (!res.ok) {
        setError(res.error)
        return false
      }
      setStatus(res.status)
      setPublishedAt(res.publishedAt)
      setSavedAt(res.savedAt)
      setSlug(res.slug)
      if (version.current === started) setDirty(false)
      if (intent === "publish") setNotice("Published. The article is live on arkanacorp.id/insight.")
      else if (intent === "schedule") setNotice(`Scheduled for ${fmtDateTime(res.publishedAt!)} WIB.`)
      else if (intent === "unpublish") setNotice("Moved back to drafts. It is no longer visible on the website.")
      else setNotice(null)
      return true
    },
    [editor, article.id, title, slug, excerpt, coverUrl, category, tags, authorId, metaTitle, metaDescription, publishAt]
  )

  // Drafts save themselves. Live articles wait for Update so half edits never reach visitors.
  useEffect(() => {
    if (!dirty || status !== "draft" || saving) return
    const t = setTimeout(() => void save("save"), 2500)
    return () => clearTimeout(t)
  }, [dirty, status, saving, save, title, excerpt, slug, coverUrl, category, tags, authorId, metaTitle, metaDescription])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])

  async function upload(file: File, target: "cover" | "body") {
    setUploading(target)
    setError(null)
    try {
      const resized = await resizeImage(file, target === "cover" ? 1920 : 1600)
      const fd = new FormData()
      fd.append("file", resized.file)
      fd.append("width", String(resized.width))
      fd.append("height", String(resized.height))
      const res = await uploadImage(fd)
      if ("error" in res) setError(res.error)
      else if (target === "cover") {
        setCoverUrl(res.url)
        touch()
      } else {
        editor?.chain().focus().setImage({ src: res.url, alt: "" }).run()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Try another image.")
    } finally {
      setUploading(null)
    }
  }

  function addTag(raw: string) {
    const value = raw.trim().replace(/,$/, "")
    if (!value || tags.includes(value) || tags.length >= 12) return
    setTags([...tags, value])
    touch()
  }

  const words = editor?.storage.characterCount.words() ?? 0
  const minutes = Math.max(1, Math.round(words / 200))
  const seoTitle = metaTitle || (title ? `${title} | Arkana` : "")
  const seoDescription = metaDescription || excerpt

  const primary =
    effective === "published"
      ? { intent: "save" as Intent, label: "Update", hint: "Push your changes to the live article" }
      : futureDate
        ? { intent: "schedule" as Intent, label: status === "scheduled" ? "Save schedule" : "Schedule", hint: "" }
        : { intent: "publish" as Intent, label: "Publish", hint: "" }

  const statusLine =
    effective === "published" && publishedAt
      ? `Live since ${fmtDateTime(publishedAt)}`
      : status === "scheduled" && publishedAt
        ? `Goes live ${fmtDateTime(publishedAt)} WIB`
        : "Draft"
  const saveLine = saving
    ? "Saving"
    : dirty
      ? effective === "draft"
        ? "Unsaved changes"
        : "Unsaved changes, press Update to publish them"
      : `Saved at ${fmtTime(savedAt)}`

  return (
    <div className="space-y-5 px-6 py-8 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Link href="/admin/insights" className="mb-2 inline-flex items-center gap-1.5 text-[13px] text-[#8A9AA6] hover:text-[#1F3442]">
            <ArrowLeft className="h-3.5 w-3.5" /> All articles
          </Link>
          <h1 className="text-[28px] font-bold tracking-tight text-[#1F3442]">{article.title ? "Edit article" : "New article"}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#6B7C88]">
            <ArticleStatusBadge status={effective} />
            {effective !== "draft" && (
              <>
                <span>{statusLine}</span>
                <span className="text-[#C2CCD2]">·</span>
              </>
            )}
            <span className={cn(dirty && effective !== "draft" && "font-bold text-amber-600")}>{saveLine}</span>
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={async () => {
              const tab = window.open("about:blank", "_blank")
              const ok = dirty ? await save("save") : true
              if (tab) {
                if (ok) tab.location.href = `/insight/${slug}?preview=1`
                else tab.close()
              }
            }}
            className="inline-flex items-center gap-2 rounded-[9px] border border-[#E7ECEF] bg-white px-4 py-2 text-[13px] font-bold transition hover:border-primary"
          >
            <Eye className="h-4 w-4" /> Preview
          </button>
          <button
            type="button"
            disabled={!!saving || (effective === "published" && !dirty)}
            onClick={() => void save(primary.intent)}
            className="inline-flex items-center gap-2 rounded-[9px] bg-primary-dark px-4 py-2 text-[13px] font-bold text-white transition hover:bg-secondary disabled:opacity-50"
          >
            {saving === primary.intent ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {primary.label}
          </button>
        </div>
      </div>

      {(error || notice) && (
        <div
          role={error ? "alert" : "status"}
          className={cn(
            "flex items-start justify-between gap-3 rounded-[10px] border px-4 py-3 text-sm",
            error ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-800"
          )}
        >
          <span>{error ?? notice}</span>
          <button type="button" aria-label="Dismiss" onClick={() => (error ? setError(null) : setNotice(null))}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_364px]">
        {/* Writing area */}
        <div className={cn(card, "space-y-5 p-5 md:p-7")}>
          <input
            ref={coverInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void upload(f, "cover")
              e.target.value = ""
            }}
          />
          <input
            ref={bodyInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void upload(f, "body")
              e.target.value = ""
            }}
          />

          {coverUrl ? (
            <div className="group relative aspect-[1200/630] overflow-hidden rounded-[12px] bg-[#F1F4F6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverUrl} alt="Cover" className="h-full w-full object-cover" />
              <div className="absolute right-3 top-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => coverInput.current?.click()}
                  className="rounded-lg bg-white/95 px-3 py-1.5 text-xs font-bold shadow-sm"
                >
                  {uploading === "cover" ? "Uploading" : "Replace cover"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCoverUrl(null)
                    touch()
                  }}
                  className="rounded-lg bg-[#1F3442]/70 px-3 py-1.5 text-xs font-bold text-white"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => coverInput.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-[#D5DEE3] bg-[#F8FAFB] py-12 text-center transition hover:border-primary hover:bg-primary/5"
            >
              {uploading === "cover" ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary-dark" />
              ) : (
                <ImagePlus className="h-6 w-6 text-primary-dark" />
              )}
              <span className="text-sm font-bold">{uploading === "cover" ? "Uploading cover" : "Add a cover image"}</span>
              <span className="text-xs text-[#8A9AA6]">1200 x 630 px works best for Google and social media. JPG, PNG, or WebP.</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <span className="rounded-full bg-primary/12 px-2.5 py-0.5 text-xs font-bold text-[#2F7F81]">{category || "General"}</span>
            <span className="text-[13px] text-[#8A9AA6]">{minutes} min read</span>
          </div>

          <textarea
            value={title}
            onChange={(e) => {
              const v = e.target.value.replace(/\n/g, " ")
              setTitle(v)
              if (!slugTouched && status === "draft") setSlug(slugify(v) || article.slug)
              touch()
            }}
            rows={1}
            maxLength={200}
            placeholder="Article title"
            aria-label="Title"
            className="field-sizing-content w-full resize-none bg-transparent text-[30px] font-bold leading-[38px] tracking-tight text-[#1F3442] outline-none placeholder:text-[#C2CCD2]"
          />
          <textarea
            value={excerpt}
            onChange={(e) => {
              setExcerpt(e.target.value.replace(/\n/g, " "))
              touch()
            }}
            rows={2}
            maxLength={300}
            placeholder="One or two sentences that sum up the article. Shown on the article list and on Google."
            aria-label="Summary"
            className="field-sizing-content w-full resize-none bg-transparent text-base leading-[26px] text-[#6B7C88] outline-none placeholder:text-[#C2CCD2]"
          />

          {editor && <Toolbar editor={editor} uploading={uploading === "body"} onImage={() => bodyInput.current?.click()} />}
          <EditorContent editor={editor} />

          <div className="flex items-center justify-between border-t border-[#EEF2F4] pt-3.5 text-xs text-[#8A9AA6]">
            <span>
              {words.toLocaleString("en-US")} words · {minutes} min read
            </span>
            <span>{effective === "draft" ? "Drafts save automatically" : "Press Update to publish changes"}</span>
          </div>
        </div>

        {/* Side panels */}
        <div className="space-y-4">
          <section className={cn(card, "space-y-3.5 p-5")}>
            <h2 className="text-[15px] font-bold">Publish</h2>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#6B7C88]">Status</span>
              <ArticleStatusBadge status={effective} />
            </div>

            {effective !== "published" && (
              <div className="space-y-1.5">
                <label htmlFor="publish-at" className={label}>
                  Publish on <span className="font-normal text-[#A3B1BA]">(WIB, leave empty to publish now)</span>
                </label>
                <div className="relative">
                  <CalendarClock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#8A9AA6]" />
                  <input
                    id="publish-at"
                    type="datetime-local"
                    value={publishAt}
                    onChange={(e) => {
                      setPublishAt(e.target.value)
                      touch()
                    }}
                    className={cn(input, "pl-9")}
                  />
                </div>
              </div>
            )}
            {effective === "published" && publishedAt && (
              <p className="text-[13px] text-[#6B7C88]">
                Live since <span className="font-bold text-[#1F3442]">{fmtDateTime(publishedAt)}</span>
              </p>
            )}

            <div className="flex gap-2 pt-1">
              {effective === "draft" ? (
                <button
                  type="button"
                  disabled={!!saving}
                  onClick={() => void save("save")}
                  className="flex-1 rounded-[9px] border border-[#E7ECEF] py-2 text-[13px] font-bold transition hover:border-primary disabled:opacity-50"
                >
                  {saving === "save" ? "Saving" : "Save draft"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!!saving}
                  onClick={() => {
                    if (confirm("Take this article off the website and move it back to drafts?")) void save("unpublish")
                  }}
                  className="flex-1 rounded-[9px] border border-[#E7ECEF] py-2 text-[13px] font-bold transition hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                >
                  {saving === "unpublish" ? "Working" : effective === "scheduled" ? "Unschedule" : "Unpublish"}
                </button>
              )}
              <button
                type="button"
                disabled={!!saving || (effective === "published" && !dirty)}
                onClick={() => void save(primary.intent)}
                className="flex-1 rounded-[9px] bg-secondary-dark py-2 text-[13px] font-bold text-white transition hover:bg-secondary disabled:opacity-50"
              >
                {saving === primary.intent ? "Working" : primary.label}
              </button>
            </div>
            {status === "scheduled" && !isLive && (
              <button
                type="button"
                disabled={!!saving}
                onClick={() => {
                  setPublishAt("")
                  void save("publish")
                }}
                className="w-full text-center text-xs font-bold text-primary-dark hover:underline"
              >
                Publish now instead
              </button>
            )}
          </section>

          <section className={cn(card, "space-y-3 p-5")}>
            <h2 className="text-[15px] font-bold">Organize</h2>
            <div className="space-y-1.5">
              <label htmlFor="category" className={label}>
                Category
              </label>
              <input
                id="category"
                list="article-categories"
                value={category}
                maxLength={60}
                onChange={(e) => {
                  setCategory(e.target.value)
                  touch()
                }}
                className={input}
              />
              <datalist id="article-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="tag-input" className={label}>
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5 rounded-[9px] border border-[#E7ECEF] p-2 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
                {tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 rounded-md bg-[#F1F4F6] py-0.5 pl-2 pr-1 text-xs">
                    {t}
                    <button
                      type="button"
                      aria-label={`Remove ${t}`}
                      onClick={() => {
                        setTags(tags.filter((x) => x !== t))
                        touch()
                      }}
                      className="rounded p-0.5 text-[#8A9AA6] hover:bg-white hover:text-[#1F3442]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  id="tag-input"
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault()
                      addTag(tagDraft)
                      setTagDraft("")
                    } else if (e.key === "Backspace" && !tagDraft && tags.length) {
                      setTags(tags.slice(0, -1))
                      touch()
                    }
                  }}
                  onBlur={() => {
                    addTag(tagDraft)
                    setTagDraft("")
                  }}
                  placeholder={tags.length ? "" : "Add tag and press Enter"}
                  className="min-w-[90px] flex-1 bg-transparent px-1 text-xs outline-none placeholder:text-[#A3B1BA]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="author" className={label}>
                Author
              </label>
              <select
                id="author"
                value={authorId}
                onChange={(e) => {
                  setAuthorId(e.target.value)
                  touch()
                }}
                className={input}
              >
                <option value="">Arkana team</option>
                {team.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className={cn(card, "space-y-3 p-5")}>
            <h2 className="text-[15px] font-bold">Search engine</h2>
            <div className="space-y-1 rounded-[10px] bg-[#F8FAFB] p-3.5">
              <p className="truncate text-xs text-[#4B5B66]">arkanacorp.id › insight › {slug}</p>
              <p className="line-clamp-2 text-base leading-[22px] text-[#1A0DAB]">{seoTitle || "Article title"}</p>
              <p className="line-clamp-2 text-[13px] leading-[19px] text-[#4D5156]">
                {seoDescription || "Add a summary so Google can show a description for this article."}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label htmlFor="meta-title" className={label}>
                  Meta title
                </label>
                <Counter value={seoTitle.length} min={30} max={60} />
              </div>
              <input
                id="meta-title"
                value={metaTitle}
                maxLength={120}
                placeholder={title ? `${title} | Arkana` : "Uses the article title"}
                onChange={(e) => {
                  setMetaTitle(e.target.value)
                  touch()
                }}
                className={input}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label htmlFor="meta-desc" className={label}>
                  Meta description
                </label>
                <Counter value={seoDescription.length} min={70} max={160} />
              </div>
              <textarea
                id="meta-desc"
                value={metaDescription}
                maxLength={320}
                rows={3}
                placeholder="Uses the summary"
                onChange={(e) => {
                  setMetaDescription(e.target.value)
                  touch()
                }}
                className={cn(input, "resize-none leading-5")}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="slug" className={label}>
                URL
              </label>
              <div className="flex items-center rounded-[9px] border border-[#E7ECEF] bg-[#F8FAFB] px-3 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
                <span className="text-[13px] text-[#8A9AA6]">/insight/</span>
                <input
                  id="slug"
                  value={slug}
                  maxLength={100}
                  onChange={(e) => {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
                    setSlugTouched(true)
                    touch()
                  }}
                  onBlur={() => setSlug(slugify(slug) || article.slug)}
                  className="min-w-0 flex-1 bg-transparent py-2 text-[13px] font-bold outline-none"
                />
              </div>
              {effective === "published" && slug !== article.slug && (
                <p className="text-xs text-amber-600">Changing the URL of a live article breaks links people already shared.</p>
              )}
            </div>
          </section>

          <form
            action={deleteArticle}
            onSubmit={(e) => {
              if (!confirm("Delete this article permanently? This cannot be undone.")) e.preventDefault()
              else setDirty(false)
            }}
          >
            <input type="hidden" name="id" value={article.id} />
            <input type="hidden" name="redirect" value="1" />
            <button className="flex w-full items-center justify-center gap-2 rounded-[10px] py-2 text-[13px] font-bold text-[#8A9AA6] transition hover:bg-red-50 hover:text-red-600">
              <Trash2 className="h-4 w-4" /> Delete article
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
