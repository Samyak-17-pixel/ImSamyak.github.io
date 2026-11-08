import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SENSORS, SENSOR_ORDER } from "@/content/sections";
import { env } from "@/lib/quality";
import { lockScroll } from "@/lib/smoothScroll";
import { sessionGet, sessionSet } from "@/lib/storage";

const KEY = "dive-intro-seen";

/** Decided once at load so the hero can time its entrance after the intro. */
export const INTRO_ACTIVE = !env.reducedMotion && typeof window !== "undefined" && sessionGet(KEY) !== "1";

const STATUS: Record<string, string> = {
  usbl: "FIX",
  imu: "ALIGNED",
  depth: "0.00 m",
  imaging: "STANDBY",
  fls: "STANDBY",
  dvl: "BOTTOM SEARCH",
  sidescan: "STANDBY",
  transponder: "4 BEACONS",
  modem: "LINK UP",
};

/** First-visit "system boot": sensor self-check ticks through, then the console floods away. */
export function DescentIntro() {
  const [show, setShow] = useState(INTRO_ACTIVE);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!show) return;
    lockScroll(true);
    const total = SENSOR_ORDER.length + 3;
    const id = window.setInterval(() => {
      setStep((s) => {
        if (s >= total) {
          window.clearInterval(id);
          window.setTimeout(() => setShow(false), 380);
          return s;
        }
        return s + 1;
      });
    }, 170);
    const skip = () => setShow(false);
    window.addEventListener("keydown", skip);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("keydown", skip);
    };
  }, [show]);

  useEffect(() => {
    if (!show) {
      sessionSet(KEY, "1");
      lockScroll(false);
    }
  }, [show]);

  const progress = Math.min(1, step / (SENSOR_ORDER.length + 2));

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="intro"
          onClick={() => setShow(false)}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-label="Loading"
        >
          <div className="intro__panel">
            <div className="intro__head">
              <span className="intro__led" />
              AUV MISSION CONSOLE · S.KUMAR
            </div>
            <ul className="intro__checks">
              {SENSOR_ORDER.map((id, i) => (
                <li key={id} className={step > i ? "is-done" : ""}>
                  <span>{SENSORS[id].short.padEnd(6, " ")}</span>
                  <span className="intro__dots" />
                  <span className="intro__status">{step > i ? STATUS[id] : "…"}</span>
                </li>
              ))}
            </ul>
            <div className="intro__bar">
              <span style={{ transform: `scaleX(${progress})` }} />
            </div>
            <div className="intro__foot">
              <span>{step > SENSOR_ORDER.length ? "ALL SYSTEMS NOMINAL — BEGIN DESCENT" : "SELF-CHECK"}</span>
              <span>click to skip</span>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
