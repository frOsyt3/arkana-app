"use client"

import Link from "next/link"
import { useActionState, useRef, useState } from "react"
import { ArrowLeft, ImagePlus, Loader2, Trash2 } from "lucide-react"
import { Field, FormMessage, SubmitButton, inputClass, type FormState } from "@/components/admin/form"
import { Panel } from "@/components/admin/page-header"
import { uploadImage } from "@/app/admin/(panel)/insights/actions"
import { projectCategories } from "@/lib/projects-data"
import { resizeImage } from "@/lib/resize-image"
import { deleteProject, saveProject } from "./actions"

export interface ProjectFormValues {
  id: string
  title: string
  slug: string
  category: string
  description: string
  sector: string
  year: string
  scope: string
  tech: string
  imageUrl: string
  domain: string
  url: string
  featured: boolean
  published: boolean
}

const EMPTY: ProjectFormValues = {
  id: "",
  title: "",
  slug: "",
  category: "Website Perusahaan",
  description: "",
  sector: "",
  year: String(new Date().getFullYear()),
  scope: "Desain, pengembangan, peluncuran",
  tech: "Next.js, Tailwind CSS, Vercel",
  imageUrl: "",
  domain: "",
  url: "",
  featured: false,
  published: true,
}

export function ProjectForm({ project, justCreated }: { project: ProjectFormValues | null; justCreated?: boolean }) {
  const p = project ?? EMPTY
  const initial: FormState = justCreated ? { ok: true, message: "Project created." } : {}
  const [state, action] = useActionState<FormState, FormData>(saveProject, initial)
  const [imageUrl, setImageUrl] = useState(p.imageUrl)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  async function onFile(file: File | undefined) {
    if (!file) return
    setUploading(true)
    setUploadError("")
    try {
      const resized = await resizeImage(file, 1600)
      const fd = new FormData()
      fd.append("file", resized.file)
      fd.append("width", String(resized.width))
      fd.append("height", String(resized.height))
      const res = await uploadImage(fd)
      if ("error" in res) setUploadError(res.error)
      else setImageUrl(res.url)
    } catch {
      setUploadError("Could not upload this image. Try a JPG or PNG.")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  return (
    <div className="space-y-5 px-6 py-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/projects" className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7C88] hover:text-[#1F3442]">
            <ArrowLeft className="h-4 w-4" /> All projects
          </Link>
          <h1 className="mt-2 text-[28px] font-bold tracking-tight text-[#1F3442]">{project ? p.title : "New project"}</h1>
        </div>
        {project && (
          <form
            action={deleteProject}
            onSubmit={(e) => {
              if (!confirm(`Delete ${p.title}? This cannot be undone.`)) e.preventDefault()
            }}
          >
            <input type="hidden" name="id" value={p.id} />
            <button className="inline-flex items-center gap-2 rounded-[9px] border border-red-200 bg-white px-4 py-2 text-[13px] font-bold text-red-600 transition hover:bg-red-50">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </form>
        )}
      </div>

      <form action={action} className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <input type="hidden" name="id" value={p.id} />
        <input type="hidden" name="imageUrl" value={imageUrl} />

        <div className="space-y-5">
          <Panel title="Details">
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <Field label="Title" className="sm:col-span-2">
                <input name="title" required defaultValue={p.title} placeholder="Martensite Workwear" className={inputClass} />
              </Field>
              <Field label="Category">
                <input name="category" list="project-categories" required defaultValue={p.category} className={inputClass} />
                <datalist id="project-categories">
                  {projectCategories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
              <Field label="Short name" hint="Optional. Made from the title when empty.">
                <input name="slug" defaultValue={p.slug} placeholder="martensite-workwear" className={inputClass} />
              </Field>
              <Field label="Description" className="sm:col-span-2" hint="Two or three sentences in Indonesian. Shown on the portfolio card.">
                <textarea name="description" required rows={4} defaultValue={p.description} className={`${inputClass} resize-y`} />
              </Field>
              <Field label="Sector">
                <input name="sector" defaultValue={p.sector} placeholder="Fashion, produksi garmen" className={inputClass} />
              </Field>
              <Field label="Year">
                <input name="year" defaultValue={p.year} className={inputClass} />
              </Field>
              <Field label="Scope" className="sm:col-span-2">
                <input name="scope" defaultValue={p.scope} className={inputClass} />
              </Field>
              <Field label="Technology" className="sm:col-span-2" hint="Separate with commas.">
                <input name="tech" defaultValue={p.tech} className={inputClass} />
              </Field>
            </div>
          </Panel>

          <Panel title="Live link" description="When a link is set, the card opens the live website.">
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <Field label="Website URL">
                <input name="url" type="url" defaultValue={p.url} placeholder="https://martensiteworkwear.com" className={inputClass} />
              </Field>
              <Field label="Address shown in the browser frame" hint="Optional. Taken from the URL when empty.">
                <input name="domain" defaultValue={p.domain} placeholder="martensiteworkwear.com" className={inputClass} />
              </Field>
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Screenshot" description="A wide screenshot of the homepage, at least 1200 pixels wide.">
            <div className="space-y-3 p-6">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] border border-[#E7ECEF] bg-[#F5F7F8]">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt="" className="h-full w-full object-cover object-top" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-[13px] text-[#A3B1BA]">No screenshot yet</span>
                )}
                {uploading && (
                  <span className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <Loader2 className="h-6 w-6 animate-spin text-primary-dark" />
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-[9px] border border-[#E7ECEF] px-3 py-2 text-[13px] font-bold transition hover:border-primary"
                >
                  <ImagePlus className="h-4 w-4" /> {imageUrl ? "Replace image" : "Upload image"}
                </button>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="rounded-[9px] border border-[#E7ECEF] px-3 py-2 text-[13px] text-[#6B7C88] transition hover:border-red-300 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => onFile(e.target.files?.[0])} />
              {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
            </div>
          </Panel>

          <Panel title="Visibility">
            <div className="space-y-3 p-6 text-[13px]">
              <label className="flex items-start gap-2.5">
                <input type="checkbox" name="published" defaultChecked={p.published} className="mt-0.5 h-4 w-4 accent-[#2F7F81]" />
                <span>
                  <span className="font-bold">Show on website</span>
                  <span className="block text-[#8A9AA6]">Turn off to keep it as a hidden draft.</span>
                </span>
              </label>
              <label className="flex items-start gap-2.5">
                <input type="checkbox" name="featured" defaultChecked={p.featured} className="mt-0.5 h-4 w-4 accent-[#2F7F81]" />
                <span>
                  <span className="font-bold">Featured</span>
                  <span className="block text-[#8A9AA6]">Shown as a large card with sector, year, and scope.</span>
                </span>
              </label>
            </div>
          </Panel>

          <div className="space-y-3">
            <SubmitButton className="w-full py-2.5">{project ? "Save changes" : "Create project"}</SubmitButton>
            <FormMessage state={state} />
          </div>
        </div>
      </form>
    </div>
  )
}
