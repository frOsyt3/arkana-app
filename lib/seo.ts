import type { Metadata } from "next"
import { companyInfo } from "@/lib/company-data"
import type { ContactSettings } from "@/lib/site-settings"

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arkanacorp.id"
export const SITE_NAME = "PT. Arkana Tunas Persada"
const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "PT. Arkana Tunas Persada, satu mitra untuk semua kebutuhan teknologi" }

/** Per page metadata with matching canonical, Open Graph, and Twitter tags. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const fullTitle = `${title} | Arkana Tunas Persada`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "id_ID", title: fullTitle, description, url: path, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [OG_IMAGE.url] },
  }
}

/** Organization and WebSite structured data, rendered once on every public page. */
export function organizationJsonLd(contact: ContactSettings) {
  const { address } = companyInfo.contact
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: "Arkana",
        foundingDate: companyInfo.foundedYear,
        foundingLocation: { "@type": "Place", name: "Kota Bandung, Jawa Barat" },
        url: SITE_URL,
        logo: `${SITE_URL}/images/arkana-mark.svg`,
        image: `${SITE_URL}/opengraph-image`,
        description:
          "Mitra teknologi untuk instansi, perusahaan, UMKM, sekolah, dan perorangan di seluruh Indonesia, meliputi pengadaan IT, infrastruktur, dan pengembangan software.",
        email: contact.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: address.street,
          addressLocality: "Bandung",
          addressRegion: address.province,
          postalCode: address.postalCode,
          addressCountry: "ID",
        },
        hasMap: contact.mapsUrl,
        geo: {
          "@type": "GeoCoordinates",
          latitude: contact.latitude,
          longitude: contact.longitude,
        },
        areaServed: { "@type": "Country", name: "Indonesia" },
        knowsAbout: [
          "Jasa pembuatan website",
          "Pengembangan aplikasi",
          "Pengadaan perangkat IT",
          "e-Katalog",
          "Infrastruktur IT",
          "Solusi cloud",
          "Keamanan siber",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "id",
      },
    ],
  }
}
