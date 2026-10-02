"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Bubbles } from "@/components/effects/Bubbles";
import { LightRays } from "@/components/effects/LightRays";
import { useUI } from "@/providers/UIProvider";

const ease = [0.22, 1, 0.36, 1] as const;

export type HeroSlide = { src: string; alt: string };

const SLIDE_MS = 6500;

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const { booted } = useUI();
  const reduced = useReducedMotion();
  const active = reduced ? true : booted;

  const count = slides.length;
  const [slide, setSlide] = useState(0);
  const current = count > 0 ? slide % count : 0;

  useEffect(() => {
    if (reduced || count <= 1) return;
    const id = window.setTimeout(() => setSlide((s) => (s + 1) % count), SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [slide, count, reduced]);

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-navy-950">
      <div className="absolute inset-0">
        {slides.map((item, i) => {
          const on = i === current;
          return (
            <div
              key={item.src}
              className={`absolute inset-0 transition-opacity duration-[1600ms] ease-in-out ${
                on ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={!on}
            >
              <Image
                src={item.src}
                alt={on ? item.alt : ""}
                fill
                priority={i === 0}
                sizes="100vw"
                quality={90}
                className={`object-cover brightness-125 saturate-150 contrast-105 ${
                  on ? (i % 2 === 0 ? "animate-kenburns" : "animate-kenburnsAlt") : ""
                }`}
              />
            </div>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/80 via-navy-950/35 to-navy-950/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/35 via-transparent to-navy-950/70" />
      </div>

      {count > 1 && (
        <div className="absolute bottom-5 right-5 z-10 flex items-center gap-1.5 sm:bottom-6 sm:right-8">
          {slides.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setSlide(i)}
              aria-label={`Show hero image ${i + 1}`}
              aria-current={i === current}
              className="group flex h-7 items-center"
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-500 ease-smooth ${
                  i === current
                    ? "w-9 bg-aqua-400"
                    : "w-3.5 bg-white/40 group-hover:w-6 group-hover:bg-white/80"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      <LightRays className="opacity-45" />
      <Bubbles count={18} density="medium" className="opacity-60" />

      <div className="container-x relative z-10 pb-32 pt-28 sm:pb-44 sm:pt-36">
        <div className="max-w-[640px]">
          <motion.p
            initial={active ? false : { opacity: 0, y: 16 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="text-[15px] font-medium tracking-wide text-aqua-300 sm:text-[17px]"
          >
            Bring the Ocean To Your Home
          </motion.p>

          <motion.h1
            initial={active ? false : { opacity: 0, y: 30 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease, delay: 0.22 }}
            className="mt-4 text-[34px] font-bold leading-[1.08] tracking-[-0.02em] text-white text-shadow-hero sm:text-[54px] lg:text-[64px]"
          >
            Healthy Fish.
            <span className="block">Beautiful Aquariums.</span>
            <span className="block text-aqua-400">Happier You.</span>
          </motion.h1>

          <motion.p
            initial={active ? false : { opacity: 0, y: 22 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.36 }}
            className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-white/80 sm:text-[17.5px]"
          >
            Discover a wide range of aquarium fish, tanks, plants, and accessories — all in
            one place.
          </motion.p>

          <motion.div
            initial={active ? false : { opacity: 0, y: 20 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.48 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-aqua-400 to-ocean-500 px-8 py-3.5 text-[15px] font-semibold text-white shadow-aquaGlow transition-all duration-300 hover:-translate-y-0.5"
            >
              Shop Now
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
