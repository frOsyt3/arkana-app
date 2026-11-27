import { Footer } from "@/components/footer";
import { PageTransitionLayout } from "@/components/page-transition-layout";
import { ScrollToTop } from "@/components/scroll-to-top";
import { AttributionTracker } from "@/components/attribution-tracker";
import { PageViewTracker } from "@/components/page-view-tracker";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SiteSettingsProvider } from "@/components/site-settings-provider";
import { organizationJsonLd } from "@/lib/seo";
import { getContactSettings, whatsappLink } from "@/lib/site-settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const contact = await getContactSettings();

  return (
    <SiteSettingsProvider contact={contact}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(contact)).replace(/</g, "\\u003c") }}
      />
      <AttributionTracker />
      <PageViewTracker />
      <ScrollToTop />
      <WhatsAppButton href={whatsappLink(contact.whatsapp)} />
      <PageTransitionLayout>{children}</PageTransitionLayout>
      <Footer />
    </SiteSettingsProvider>
  );
}
