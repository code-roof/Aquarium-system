import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Bubbles } from "@/components/effects/Bubbles";

export function TankBanner() {
  return (
    <section className="pb-24 sm:pb-32">
      <Reveal>
        <div className="relative min-h-[400px] overflow-hidden sm:min-h-[460px]">
          <Image
            src="/images/banners/sea-turtle-underwater-36132584.jpg"
            alt="Sea turtle swimming over a coral reef"
            fill
            sizes="100vw"
            quality={90}
            className="object-cover brightness-110 saturate-[1.25] contrast-105"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-ocean-900/70 via-ocean-800/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/45 via-transparent to-transparent" />

          <Bubbles count={22} density="medium" className="opacity-70" />

          <div className="container-x relative z-10 flex min-h-[400px] flex-col items-start justify-center gap-5 py-16 text-left sm:min-h-[460px]">
            <h2 className="max-w-2xl text-[27px] font-bold leading-[1.14] tracking-[-0.02em] text-white drop-shadow-[0_2px_12px_rgba(4,32,53,0.45)] sm:text-[34px] lg:text-[38px]">
              Everything You Need to Start Your Aquarium
            </h2>
            <p className="max-w-xl text-[15.5px] leading-relaxed text-white/90 drop-shadow-[0_1px_8px_rgba(4,32,53,0.4)] sm:text-[16.5px]">
              Every tank is stocked with healthy, quarantined fish, premium plants and all the
              gear to keep them thriving.
            </p>
            <Link
              href="/shop?category=tanks"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[15px] font-semibold text-ocean-800 shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua-400 hover:text-navy-950"
            >
              Shop Complete Sets
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
