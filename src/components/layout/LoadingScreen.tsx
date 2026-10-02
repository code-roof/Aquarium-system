"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { Bubbles } from "@/components/effects/Bubbles";
import { LightRays } from "@/components/effects/LightRays";
import { useUI } from "@/providers/UIProvider";

export function LoadingScreen() {
  const { booted, setBooted, firstVisit } = useUI();
  const [visible, setVisible] = useState(true);
  const reduced = useReducedMotion();

  // Phase 1 — start the intro timer (StrictMode-safe: effect may re-run, timer is
  // always re-scheduled while booted is false, so boot can never be skipped).
  // The full intro plays only on the first visit of a session; refreshes and
  // client-side navigations get a short branded flash instead of a 2.4s block.
  useEffect(() => {
    if (booted) return;
    const hold = firstVisit ? (reduced ? 400 : 2400) : reduced ? 0 : 420;
    const t = window.setTimeout(() => setBooted(true), hold);
    return () => window.clearTimeout(t);
  }, [booted, reduced, setBooted, firstVisit]);

  // Phase 1b — on repeat visits, never peel the overlay off before the document has
  // really loaded, otherwise a slow compile reveals a blank white page under the
  // loader. The first-visit intro is ignored here so it always plays in full.
  useEffect(() => {
    if (firstVisit) return;
    if (document.readyState === "complete") return;
    const onLoad = () => setBooted(true);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [firstVisit, setBooted]);

  // Phase 2 — hide the overlay once booted (fast exit on repeat visits).
  useEffect(() => {
    if (!booted) return;
    const t = window.setTimeout(() => setVisible(false), firstVisit ? 720 : 90);
    return () => window.clearTimeout(t);
  }, [booted, firstVisit]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] overflow-hidden bg-navy-950"
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          aria-hidden={!booted}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            style={{
              background:
                "radial-gradient(120% 90% at 50% 120%, #0B76D1 0%, #064a7d 35%, #042035 70%, #02141F 100%)",
            }}
          />

          <motion.div
            className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1.4, opacity: [0, 0.55, 0.25] }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            style={{ background: "radial-gradient(circle, rgba(30,144,240,0.55), transparent 62%)" }}
          />

          <LightRays className="opacity-70" />
          <Bubbles count={26} density="medium" />

          {!reduced && (
            <motion.svg
              viewBox="0 0 120 60"
              className="absolute left-0 top-[54%] h-10 w-24 text-white/25"
              initial={{ x: "-20vw", opacity: 0 }}
              animate={{ x: "115vw", opacity: [0, 0.8, 0.8, 0] }}
              transition={{ duration: 3.2, ease: "easeInOut", delay: 0.6 }}
            >
              <path
                d="M8 30c18-16 46-22 70-12 8-8 22-12 34-14-6 9-8 17-6 26-2 9 0 17 6 26-12-2-26-6-34-14-24 10-52 4-70-12Z"
                fill="currentColor"
              />
              <circle cx="30" cy="26" r="3" fill="#042035" />
            </motion.svg>
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6">
            <motion.div
              initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <Logo light />
            </motion.div>

            <div className="h-px w-40 overflow-hidden bg-white/15">
              <motion.div
                className="h-full bg-gradient-to-r from-aqua-400 to-ocean-400"
                initial={{ x: "-100%" }}
                animate={{ x: booted ? "0%" : "40%" }}
                transition={{ duration: reduced ? 0.3 : 2, ease: "easeInOut" }}
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-center text-[13px] uppercase tracking-[0.4em] text-white/55"
            >
              Nature in Every Drop
            </motion.p>
          </div>

          <motion.div
            className="absolute inset-0 origin-top bg-gradient-to-b from-ocean-600 via-ocean-500 to-aqua-400"
            initial={{ scaleY: 0 }}
            animate={booted && firstVisit ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
