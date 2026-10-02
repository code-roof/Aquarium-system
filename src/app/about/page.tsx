import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Fish, HeartHandshake, ShieldCheck, Store } from "lucide-react";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of aquarium.lk — a Colombo aquatic store shipping healthy fish and honest equipment across Sri Lanka.",
};

const milestones = [
  { year: "2016", title: "One tank, one living room", text: "aquarium.lk began as a hobby project in Nugegoda with a single planted tank." },
  { year: "2019", title: "First flagship store", text: "We opened the Marine Drive showroom so customers could see systems running before buying." },
  { year: "2022", title: "Livestock done right", text: "A dedicated quarantine room was built so every fish is conditioned before it ships." },
  { year: "2026", title: "Island-wide delivery", text: "Today we deliver oxygen-packed livestock and equipment to every province in Sri Lanka." },
];

const values = [
  { icon: Fish, title: "Healthy livestock", text: "Quarantined, conditioned and fed before dispatch — with a live arrival guarantee." },
  { icon: ShieldCheck, title: "Honest equipment", text: "We stock gear we run on our own systems. If we would not use it, we do not sell it." },
  { icon: HeartHandshake, title: "Guidance that stays", text: "Cycling, scaping and stocking advice continues long after the delivery arrives." },
  { icon: Store, title: "Real local presence", text: "A physical Colombo store you can visit, with a team that knows every tank in it." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-950 pb-24 pt-[150px]">
        <div className="absolute inset-0">
          <Image
            src="/images/about/aquarium-shop-store-126211650.jpg"
            alt="Inside the aquarium.lk store"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/75 to-navy-950/40" />
        </div>
        <div className="container-x relative z-10">
          <Reveal>
            <span className="eyebrow text-aqua-400">Our story</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-3 max-w-3xl text-balance text-[40px] font-bold leading-[1.06] tracking-[-0.03em] text-white sm:text-[56px]">
              Built by hobbyists, for hobbyists
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/65">
              aquarium.lk is a Colombo-based aquatic store with one belief: keeping fish should feel
              like nature in every drop — healthy animals, honest gear and advice that actually works.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/shop" className="btn-primary group">
                Shop the collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="btn-ghost">
                Visit our store
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x grid items-center gap-14 py-24 lg:grid-cols-2 lg:py-32">
        <div className="relative">
          <ParallaxImage
            src="/images/about/man-looking-at-aquarium-7490461.jpg"
            alt="Aquarist observing a display tank"
            reveal
            className="aspect-[4/5] overflow-hidden rounded-3xl"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute -bottom-6 -right-4 hidden rounded-3xl bg-white px-6 py-5 shadow-lift sm:block">
            <p className="text-[13px] uppercase tracking-[0.16em] text-slate-400">Since</p>
            <p className="text-[26px] font-bold text-ocean-600">2016</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-6">
          <SectionHeading
            eyebrow="Why we exist"
            title="An underwater world should be effortless"
            description="Most aquarium problems start with bad advice or bad livestock. We built aquarium.lk around the two things that fix that: healthy animals and equipment we actually run ourselves."
          />
          <p className="text-[15.5px] leading-relaxed text-slate-600">
            Every fish that leaves our store passes through a quarantine room, gets conditioned on
            live food and is packed in oxygenated, temperature-stable bags. Every filter, heater and
            light on the shelf is one we have tested on our own display systems.
          </p>
          <p className="text-[15.5px] leading-relaxed text-slate-600">
            The result is a store you can trust with your first betta or your twentieth aquascape —
            because the same team that answers your WhatsApp message is the team that packed your
            order.
          </p>
        </div>
      </section>

      <section className="bg-mist py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="What we stand for"
            title="Four promises in every order"
          />
          <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <div className="card-base h-full p-6 transition hover:-translate-y-1.5 hover:shadow-lift">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean-50 text-ocean-600">
                    <value.icon size={22} />
                  </span>
                  <h3 className="mt-4 text-[17px] font-bold text-navy-950">{value.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-slate-500">{value.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="container-x py-24 sm:py-32">
        <SectionHeading eyebrow="Milestones" title="How we got here" />
        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {milestones.map((item, index) => (
            <Reveal key={item.year} delay={index * 0.08}>
              <div className="relative border-t-2 border-ocean-100 pt-6">
                <span className="absolute -top-[7px] left-0 h-3 w-3 rounded-full bg-ocean-500 ring-4 ring-ocean-100" />
                <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-ocean-600">
                  {item.year}
                </p>
                <h3 className="mt-2 text-[18px] font-bold text-navy-950">{item.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-slate-500">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <StaggerContainer className="mt-16 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {[
            "/images/about/aquarium-maintenance-4792525.jpg",
            "/images/about/child-watching-fish-tank-33314491.jpg",
            "/images/about/woman-looking-at-aquarium-19365790.jpg",
            "/images/about/aquarium-exhibition-71802482.jpg",
          ].map((src) => (
            <StaggerItem key={src}>
              <div className="relative aspect-square overflow-hidden rounded-3xl">
                <Image src={src} alt="aquarium.lk team and community" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <FinalCTA />
    </>
  );
}
