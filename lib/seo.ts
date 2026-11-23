import type { Metadata } from "next"
import { companyInfo } from "@/lib/company-data"

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arkanacorp.id"
export const SITE_NAME = "PT. Arkana Tunas Persada"
const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "PT. Arkana Tunas Persada, IT solutions and procurement partner" }

/** Per page metadata with matching canonical, Open Graph, and Twitter tags. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const fullTitle = `${title} | Arkana Tunas Persada`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", title: fullTitle, description, url: path, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [OG_IMAGE.url] },
  }
}

/** Organization and WebSite structured data, rendered once on every public page. */
export function organizationJsonLd() {
  const { address, email } = companyInfo.contact
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: "Arkana",
        url: SITE_URL,
        logo: `${SITE_URL}/images/arkana-mark.svg`,
        image: `${SITE_URL}/opengraph-image`,
        description:
          "IT solutions and registered procurement partner for government and enterprise across Indonesia, covering IT procurement, infrastructure, and software development.",
        email: email.general,
        address: {
          "@type": "PostalAddress",
          streetAddress: address.street,
          addressLocality: "Bandung",
          addressRegion: address.province,
          postalCode: address.postalCode,
          addressCountry: "ID",
        },
        hasMap: address.googleMapsUrl,
        areaServed: { "@type": "Country", name: "Indonesia" },
        knowsAbout: [
          "IT procurement",
          "e-Katalog",
          "IT infrastructure",
          "Software development",
          "Cloud solutions",
          "Cybersecurity",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
    ],
  }
}
