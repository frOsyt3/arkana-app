"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Field, FormMessage, SubmitButton, inputClass, type FormState } from "@/components/admin/form"
import { Panel } from "@/components/admin/page-header"
import { CopyButton } from "./copy-button"
import { deleteCampaign, saveCampaign } from "./actions"

interface Values {
  id: string
  name: string
  channel: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  landingPath: string
  spend: number
  startDate: string
  endDate: string
  notes: string
}

const toTag = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80)

export function CampaignForm({
  values: v,
  channels,
  siteUrl,
  justCreated,
}: {
  values: Values
  channels: Record<string, { source: string; medium: string }>
  siteUrl: string
  justCreated?: boolean
}) {
  const [state, action] = useActionState<FormState, FormData>(saveCampaign, justCreated ? { ok: true, message: "Campaign created. Copy the link into your ad." } : {})
  const [name, setName] = useState(v.name)
  const [channel, setChannel] = useState(v.channel)
  const [source, setSource] = useState(v.utmSource)
  const [medium, setMedium] = useState(v.utmMedium)
  const [tag, setTag] = useState(v.utmCampaign)
  const [path, setPath] = useState(v.landingPath)

  const finalTag = tag || toTag(name)
  let preview = ""
  try {
    const url = new URL(path.startsWith("/") ? path : `/${path}`, siteUrl)
    if (source) url.searchParams.set("utm_source", toTag(source))
    if (medium) url.searchParams.set("utm_medium", toTag(medium))
    if (finalTag) url.searchParams.set("utm_campaign", finalTag)
    preview = url.toString()
  } catch {
    preview = ""
  }

  return (
    <div className="space-y-5 px-6 py-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/campaigns" className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7C88] hover:text-[#1F3442]">
            <ArrowLeft className="h-4 w-4" /> All campaigns
          </Link>
          <h1 className="mt-2 text-[28px] font-bold tracking-tight text-[#1F3442]">{v.id ? v.name : "New campaign"}</h1>
        </div>
        {v.id && (
          <form
            action={deleteCampaign}
            onSubmit={(e) => {
              if (!confirm("Delete this campaign? Leads it brought in are kept.")) e.preventDefault()
            }}
          >
            <input type="hidden" name="id" value={v.id} />
            <button className="inline-flex items-center gap-2 rounded-[9px] border border-red-200 bg-white px-4 py-2 text-[13px] font-bold text-red-600 transition hover:bg-red-50">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </form>
        )}
      </div>

      <form action={action} className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <input type="hidden" name="id" value={v.id} />
        <div className="space-y-5">
          <Panel title="Campaign">
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <Field label="Name" className="sm:col-span-2">
                <input name="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Promo pengadaan laptop Desember" className={inputClass} />
              </Field>
              <Field label="Channel">
                <select
                  name="channel"
                  value={channel}
                  onChange={(e) => {
                    setChannel(e.target.value)
                    const preset = channels[e.target.value]
                    if (preset?.source) {
                      setSource(preset.source)
                      setMedium(preset.medium)
                    }
                  }}
                  className={inputClass}
                >
                  {Object.keys(channels).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Landing page" hint="Where the link opens, for example /contact or /projects.">
                <input name="landingPath" required value={path} onChange={(e) => setPath(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Source (utm_source)">
                <input name="utmSource" required value={source} onChange={(e) => setSource(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Medium (utm_medium)">
                <input name="utmMedium" required value={medium} onChange={(e) => setMedium(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Campaign tag (utm_campaign)" className="sm:col-span-2" hint="Optional. Made from the name when empty. Leads are counted by this tag.">
                <input name="utmCampaign" value={tag} onChange={(e) => setTag(e.target.value)} placeholder={toTag(name) || "promo_laptop_desember"} className={inputClass} />
              </Field>
            </div>
          </Panel>
          <Panel title="Tracked link" description="Use this as the destination URL in your ad or broadcast.">
            <div className="flex items-center gap-2 p-6">
              <code className="min-w-0 flex-1 break-all rounded-md bg-[#F5F7F8] px-3 py-2 text-xs text-[#4B5B66]">{preview || "Fill in the form to build the link"}</code>
              {preview && <CopyButton text={preview} />}
            </div>
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel title="Budget and dates">
            <div className="grid gap-4 p-6">
              <Field label="Total spend (Rp)" hint="Update this as the ad runs to keep cost per lead accurate.">
                <input name="spend" inputMode="numeric" defaultValue={v.spend ? String(v.spend) : ""} placeholder="500000" className={inputClass} />
              </Field>
              <Field label="Start date">
                <input name="startDate" type="date" defaultValue={v.startDate} className={inputClass} />
              </Field>
              <Field label="End date">
                <input name="endDate" type="date" defaultValue={v.endDate} className={inputClass} />
              </Field>
              <Field label="Notes">
                <textarea name="notes" rows={3} defaultValue={v.notes} className={`${inputClass} resize-y`} />
              </Field>
            </div>
          </Panel>
          <SubmitButton className="w-full py-2.5">{v.id ? "Save changes" : "Create campaign"}</SubmitButton>
          <FormMessage state={state} />
        </div>
      </form>
    </div>
  )
}
