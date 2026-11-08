import { lazy, Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Nav } from "./Nav";
import { WaterRippleOverlay } from "../effects/WaterRippleOverlay";
import { SonarCursor } from "../effects/SonarCursor";
import { DescentIntro } from "../effects/DescentIntro";
import { SonarWipe } from "../effects/SonarWipe";
import { CommandPalette } from "../nav/CommandPalette";
import { DepthGaugeNav } from "../hud/DepthGaugeNav";
import { InstrumentRail } from "../hud/InstrumentRail";
import { DepthPill } from "../hud/DepthPill";
import { initSmoothScroll } from "@/lib/smoothScroll";
import { isDivePath } from "@/lib/navigation";
import { ScrollTrigger } from "@/lib/gsap";

// Loaded only when the full three.js background is switched on.
const MarineScene = lazy(() => import("../three/MarineScene").then((m) => ({ default: m.MarineScene })));

export function MainLayout() {
  const { pathname } = useLocation();
  // All dive URLs share one page instance; detail pages are keyed by their path.
  const routeKey = isDivePath(pathname) ? "dive" : pathname;

  useEffect(() => initSmoothScroll(), []);

  useEffect(() => {
    // Late font loads shift layout; re-measure triggers once they land.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <div className="app-root">
      <Suspense fallback={<div className="canvas-layer canvas-layer--static" aria-hidden />}>
        <MarineScene className="canvas-layer" />
      </Suspense>
      <div className="canvas-veil" aria-hidden />
      <div className="grain" aria-hidden />
      <WaterRippleOverlay />
      <Nav />
      <main className="page-main" id="main">
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
          <motion.div
            key={routeKey}
            className="page-motion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => ScrollTrigger.refresh()}
          >
            <Suspense fallback={<div className="page-loading" role="status">Acquiring…</div>}>
              <Outlet />
            </Suspense>
          </motion.div>
        </AnimatePresence>
        <SonarWipe key={`wipe-${routeKey}`} />
      </main>
      {routeKey === "dive" ? (
        <>
          <DepthGaugeNav />
          <InstrumentRail />
          <DepthPill />
        </>
      ) : null}
      <CommandPalette />
      <SonarCursor />
      <DescentIntro />
    </div>
  );
}
