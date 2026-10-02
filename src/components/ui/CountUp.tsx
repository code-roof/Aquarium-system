"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

interface Props {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
}

export function CountUp({
  to,
  from = 0,
  duration = 1800,
  delay = 0,
  prefix = "",
  suffix = "",
  separator = ",",
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    if (!inView) return;

    let raf = 0;
    let start: number | null = null;

    const timer = setTimeout(() => {
      const tick = (now: number) => {
        if (start === null) start = now;
        const t = Math.min((now - start) / duration, 1);
        setValue(from + (to - from) * easeOutExpo(t));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [inView, reduced, from, to, duration, delay]);

  const display = Math.round(value)
    .toLocaleString("en-US")
    .replace(/,/g, separator);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
