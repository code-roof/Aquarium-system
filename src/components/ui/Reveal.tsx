"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

type Variant = "fade" | "up" | "left" | "right" | "scale" | "clip";

interface Props {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

const variants: Record<Variant, Variants> = {
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  up: { hidden: { opacity: 0, y: 34 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -36 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 36 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1 } },
  clip: {
    hidden: { opacity: 0, clipPath: "inset(12% 12% 12% 12% round 24px)" },
    show: { opacity: 1, clipPath: "inset(0% 0% 0% 0% round 24px)" },
  },
};

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration = 0.7,
  className,
  once = true,
  amount = 0.25,
}: Props) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={variants[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.09,
  amount = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
