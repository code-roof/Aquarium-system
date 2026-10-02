import Link from "next/link";
import { ArrowRight, Fish, HeartHandshake, Store } from "lucide-react";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const stats = [
  { value: 2016, from: 2010, suffix: "", separator: "", label: "Serving hobbyists since" },
  { value: 8400, from: 0, suffix: "+", separator: ",", label: "Happy aquarists" },
  { value: 500, from: 0, suffix: "+", separator: ",", label: "Products in stock" },
  { value: 24, from: 0, suffix: "h", separator: ",", label: "Average response time" },
];

const values = [
  {
    icon: Fish,
    title: "Livestock first",
    text: "Every fish is quarantined, conditioned and fed before it ever reaches a customer tank.",
  },
  {
    icon: Store,
    title: "Real local store",
    text: "Visit our Colombo showroom, see the systems running and talk to the people who built them.",
  },
  {
    icon: HeartHandshake,
    title: "Lifetime guidance",
    text: "Cycling, scaping, stocking — our team stays with you long after the delivery arrives.",
  },
];

export function StorySection() {
  return (
    <section className="bg-mist py-24 sm:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <div className="relative">
          <div className="grid grid-cols-2 gap-5">
            <ParallaxImage
              src="/images/about/aquarium-shop-store-19603575.jpg"
              alt="Aquarium store interior with rows of tanks"
              reveal
              speed={50}
              className="aspect-[4/5] overflow-hidden rounded-3xl"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="flex flex-col gap-5 pt-10">
              <ParallaxImage
                src="/images/about/man-looking-at-aquarium-5428950.jpg"
                alt="Customer admiring an aquarium"
                reveal
                speed={34}
                className="aspect-square overflow-hidden rounded-3xl"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <ParallaxImage
                src="/images/about/aquarium-maintenance-27176670.jpg"
                alt="Aquarium maintenance in progress"
                reveal
                speed={64}
                className="aspect-[4/3] overflow-hidden rounded-3xl"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </div>

          <span className="absolute -bottom-7 -left-3 hidden rounded-3xl bg-white px-6 py-5 shadow-lift sm:block">
            <span className="block text-[13px] uppercase tracking-[0.16em] text-slate-400">
              Colombo flagship
            </span>
            <span className="block text-[18px] font-bold text-navy-950">
              42 Marine Drive
            </span>
          </span>
        </div>

        <div className="flex flex-col items-start gap-6">
          <SectionHeading
            eyebrow="Our story"
            title="Built by hobbyists, for hobbyists"
            description="aquarium.lk started as a single tank in a Colombo living room. Today it is a full aquatic store that ships healthy livestock and honest equipment across Sri Lanka."
          />

          <StaggerContainer className="flex flex-col gap-4">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-lift">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600">
                    <value.icon size={20} />
                  </span>
                  <span>
                    <span className="block text-[15.5px] font-semibold text-navy-950">
                      {value.title}
                    </span>
                    <span className="mt-1 block text-[14.5px] leading-relaxed text-slate-500">
                      {value.text}
                    </span>
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <Reveal delay={0.2}>
            <Link
              href="/about"
              className="group -mx-2 inline-flex min-h-[44px] items-center gap-2 px-2 text-[15px] font-semibold text-ocean-700 hover:text-ocean-500 lg:min-h-0 lg:px-0"
            >
              Read our full story
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>

      <div className="container-x mt-20">
        <StaggerContainer className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-100 bg-slate-100 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StaggerItem key={stat.label}>
              <div className="flex h-full flex-col items-center gap-1 bg-white px-6 py-8 text-center">
                <CountUp
                  to={stat.value}
                  from={stat.from}
                  suffix={stat.suffix}
                  separator={stat.separator}
                  delay={i * 0.12}
                  className="text-[30px] font-bold tabular-nums tracking-[-0.02em] text-ocean-600 sm:text-[36px]"
                />
                <span className="text-[13.5px] text-slate-500">{stat.label}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
