import { Footer } from "@/components/footer";
import { PageTransitionLayout } from "@/components/page-transition-layout";
import { ScrollToTop } from "@/components/scroll-to-top";
import { AttributionTracker } from "@/components/attribution-tracker";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AttributionTracker />
      <ScrollToTop />
      <PageTransitionLayout>{children}</PageTransitionLayout>
      <Footer />
    </>
  );
}
