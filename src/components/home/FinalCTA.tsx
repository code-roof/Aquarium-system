import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { Bubbles } from "@/components/effects/Bubbles";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/images/hero/aquarium-coral-reef-12829679.jpg"
        alt="Sunbeams streaming through a calm blue aquarium"
        fill
        sizes="100vw"
        quality={90}
        priority
        className="object-cover brightness-105 saturate-[1.2]"
      />
      <div className="absolute inset-0 bg-navy-950/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-navy-950/10 to-navy-950/25" />
      <Bubbles count={18} density="medium" className="opacity-60" />

      <div className="container-x relative z-10 flex flex-col items-center gap-5 py-12 text-center sm:gap-5 sm:py-16">
        <Reveal>
          <span className="eyebrow text-aqua-400">Start your underwater world</span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="text-balance max-w-3xl text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-white drop-shadow-[0_2px_14px_rgba(4,32,53,0.5)] sm:text-[44px]">
            Your dream aquarium is one click away
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="max-w-xl text-[16.5px] leading-relaxed text-white/85">
            Order online for island-wide delivery, or visit our Colombo store and design your setup
            with our aquascaping team.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[15px] font-semibold text-ocean-800 shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua-400 hover:text-navy-950"
            >
              Shop now
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/60 px-8 py-3.5 text-[15px] font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
            >
              <MapPin size={16} /> Visit the store
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
