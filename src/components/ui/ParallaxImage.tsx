"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  speed?: number;
  reveal?: boolean;
  priority?: boolean;
  fill?: boolean;
  quality?: number;
}

export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  speed = 60,
  reveal = false,
  priority = false,
  quality = 82,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={reveal && !reduced ? { clipPath: "inset(8% 8% 8% 8% round 28px)" } : undefined}
    >
      <motion.div
        initial={reveal ? { clipPath: "inset(14% 14% 14% 14% round 28px)", opacity: 0.4 } : false}
        whileInView={reveal ? { clipPath: "inset(0% 0% 0% 0% round 28px)", opacity: 1 } : undefined}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={reduced ? undefined : { y }}
        className="h-full w-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={quality}
          className={cn("object-cover", imgClassName)}
        />
      </motion.div>
    </div>
  );
}
