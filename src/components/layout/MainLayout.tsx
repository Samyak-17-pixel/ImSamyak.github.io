import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Nav } from "./Nav";
import { WaterRippleOverlay } from "../effects/WaterRippleOverlay";
import { SensorHud } from "../hud/SensorHud";
import { MarineScene } from "../three/MarineScene";

export function MainLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="app-root">
      <MarineScene
        intensity={isHome ? "hero" : "ambient"}
        className="canvas-layer"
      />
      <div className="canvas-veil" aria-hidden />
      <SensorHud />
      <WaterRippleOverlay />
      <Nav />
      <main className="page-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            className="page-motion"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
