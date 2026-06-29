import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { CartFlyOverlay } from "@/components/motion/CartFlyOverlay";
import { AmbientPlayerProvider } from "@/components/audio/ambient-player.context";
import { PlayerMount } from "@/components/audio/PlayerMount";

// Site chrome — wraps every public page but NOT the embedded Sanity Studio
// at /studio, which lives outside this route group and therefore renders
// without Lenis, the header/footer, or the page-transition template.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AmbientPlayerProvider>
      <SmoothScroll>
        <CustomCursor />
        <CartFlyOverlay />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <PlayerMount />
      </SmoothScroll>
    </AmbientPlayerProvider>
  );
}
