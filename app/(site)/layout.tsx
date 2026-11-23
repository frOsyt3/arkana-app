import { Footer } from "@/components/footer";
import { PageTransitionLayout } from "@/components/page-transition-layout";
import { ScrollToTop } from "@/components/scroll-to-top";
import { AttributionTracker } from "@/components/attribution-tracker";
import { organizationJsonLd } from "@/lib/seo";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()).replace(/</g, "\\u003c") }}
      />
      <AttributionTracker />
      <ScrollToTop />
      <PageTransitionLayout>{children}</PageTransitionLayout>
      <Footer />
    </>
  );
}
