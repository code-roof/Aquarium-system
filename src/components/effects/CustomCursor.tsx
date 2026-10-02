"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.6 });
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [image, setImage] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduced);
    if (!fine || reduced) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest("a, button, [role='button'], input, textarea, select, label");
      const media = target?.closest("[data-cursor='media']");
      setActive(Boolean(interactive));
      setImage(Boolean(media) && !interactive);
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ x: springX, y: springY }}
        className="pointer-events-none fixed left-0 top-0 z-[95] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.span
          animate={{
            width: active ? 52 : image ? 64 : 22,
            height: active ? 52 : image ? 64 : 22,
            opacity: active || image ? 1 : 0.65,
            borderColor: image ? "rgba(63,227,232,0.9)" : "rgba(30,144,240,0.75)",
          }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="absolute left-0 top-0 block -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-ocean-500/5 backdrop-blur-[2px]"
          style={{ width: 22, height: 22 }}
        />
      </motion.div>
      <motion.div
        aria-hidden="true"
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[96] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ocean-500"
      />
    </>
  );
}
