"use client"

import { useActionState } from "react"
import { Field, FormMessage, SubmitButton, inputClass, type FormState } from "@/components/admin/form"
import { Panel } from "@/components/admin/page-header"
import type { ContactSettings } from "@/lib/site-settings"
import { saveContactSettings } from "./actions"

export function SettingsForm({ contact }: { contact: ContactSettings }) {
  const [state, action] = useActionState<FormState, FormData>(saveContactSettings, {})

  return (
    <form action={action} className="grid gap-5 xl:grid-cols-2">
      <Panel title="Contact" description="How customers reach you.">
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <Field label="Email" className="sm:col-span-2">
            <input name="email" type="email" required defaultValue={contact.email} className={inputClass} />
          </Field>
          <Field label="WhatsApp number" hint="Used by every WhatsApp button on the site.">
            <input name="whatsapp" required defaultValue={contact.whatsapp} className={inputClass} />
          </Field>
          <Field label="Office phone">
            <input name="phone" defaultValue={contact.phone} className={inputClass} />
          </Field>
          <label className="flex items-center gap-2.5 text-[13px] sm:col-span-2">
            <input type="checkbox" name="showPhone" defaultChecked={contact.showPhone} className="h-4 w-4 accent-[#2F7F81]" />
            Show the office phone number on the website
          </label>
        </div>
      </Panel>

      <Panel title="Office location" description="Address and map pin for the contact page.">
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <Field label="Full address" className="sm:col-span-2">
            <input name="address" required defaultValue={contact.address} className={inputClass} />
          </Field>
          <Field label="Google Maps link" className="sm:col-span-2">
            <input name="mapsUrl" type="url" required defaultValue={contact.mapsUrl} className={inputClass} />
          </Field>
          <Field label="Latitude" hint="In Google Maps, right click the pin to copy the numbers.">
            <input name="latitude" inputMode="decimal" required defaultValue={contact.latitude} className={inputClass} />
          </Field>
          <Field label="Longitude">
            <input name="longitude" inputMode="decimal" required defaultValue={contact.longitude} className={inputClass} />
          </Field>
        </div>
      </Panel>

      <Panel title="Business hours">
        <div className="grid gap-4 p-6">
          <Field label="Weekdays">
            <input name="hoursWeekdays" defaultValue={contact.hoursWeekdays} className={inputClass} />
          </Field>
          <Field label="Saturday">
            <input name="hoursSaturday" defaultValue={contact.hoursSaturday} className={inputClass} />
          </Field>
          <Field label="Sunday">
            <input name="hoursSunday" defaultValue={contact.hoursSunday} className={inputClass} />
          </Field>
        </div>
      </Panel>

      <Panel title="Social media" description="Leave a field empty to hide that icon in the footer.">
        <div className="grid gap-4 p-6">
          <Field label="LinkedIn">
            <input name="linkedin" type="url" defaultValue={contact.linkedin} className={inputClass} />
          </Field>
          <Field label="Instagram">
            <input name="instagram" type="url" defaultValue={contact.instagram} className={inputClass} />
          </Field>
        </div>
      </Panel>

      <div className="flex flex-wrap items-center gap-3 xl:col-span-2">
        <SubmitButton>Save settings</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  )
}
