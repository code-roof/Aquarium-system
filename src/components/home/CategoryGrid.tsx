import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerContainer, StaggerItem } from "@/components/ui/Reveal";

export function CategoryGrid() {
  return (
    <section className="container-x py-24 sm:py-32">
      <SectionHeading
        eyebrow="Browse the store"
        title="Everything your aquarium needs"
        description="From quarantined livestock to rimless tanks and pro-grade equipment — shop by category."
        descriptionClassName="max-w-none whitespace-normal text-[15px] sm:whitespace-nowrap sm:text-[16px]"
        action={
          <Link
            href="/shop"
            className="group hidden items-center gap-1.5 text-[15px] font-semibold text-ocean-700 hover:text-ocean-500 sm:inline-flex"
          >
            All categories
            <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5" />
          </Link>
        }
      />

      <StaggerContainer className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <StaggerItem key={category.id} className="h-full">
            <Link
              href={category.href}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-ocean-50 shadow-card transition-all duration-500 ease-smooth hover:-translate-y-1.5 hover:border-ocean-200 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ocean-500"
            >
              <span className="relative block aspect-square overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-[1.07]"
                />
                <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-aqua-400/25 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              </span>

              <span className="flex flex-1 flex-col gap-1.5 bg-gradient-to-b from-ocean-50 to-ocean-100 p-4 text-left">
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ocean-600 sm:text-[10px] sm:tracking-[0.18em]">
                  {category.count} products
                </span>
                <span className="flex items-end justify-between gap-2">
                  <span className="text-[15px] font-bold leading-tight text-ink">
                    {category.name}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-ocean-600 shadow-card transition-all duration-300 group-hover:bg-aqua-500 group-hover:text-navy-950">
                    <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </span>
                <span className="text-[12.5px] leading-snug text-ink/60 line-clamp-2">
                  {category.description}
                </span>
              </span>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
