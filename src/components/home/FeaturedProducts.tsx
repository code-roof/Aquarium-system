"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Star } from "lucide-react";
import { products } from "@/data/products";
import { StaggerContainer, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function FeaturedProducts() {
  const fish = useMemo(
    () => products.filter((p) => p.category === "fish").slice(0, 6),
    []
  );

  return (
    <section className="container-x pb-24 sm:pb-32">
      <SectionHeading
        eyebrow="Fresh arrivals"
        title="Featured this week"
        description="Hand-pick live freshwater and marine fish, quarantined and ready for your tank."
        descriptionClassName="max-w-none whitespace-normal text-[15px] sm:whitespace-nowrap sm:text-[16px]"
        action={
          <Link
            href="/shop?category=fish"
            className="group hidden items-center gap-1.5 text-[15px] font-semibold text-ocean-700 hover:text-ocean-500 sm:inline-flex"
          >
            All live fish
            <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5" />
          </Link>
        }
      />

      <StaggerContainer className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {fish.map((product) => (
          <StaggerItem key={product.id} className="h-full">
            <FishCard product={product} />
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="mt-12 flex justify-center">
        <Link
          href="/shop?category=fish"
          className="group inline-flex items-center gap-2 rounded-full border border-ocean-200 bg-white px-7 py-3.5 text-[15px] font-semibold text-ocean-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-ocean-400 hover:bg-ocean-50 hover:shadow-card"
        >
          View all live fish
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

function FishCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-ocean-50 shadow-card transition-all duration-500 ease-smooth hover:-translate-y-1.5 hover:border-ocean-200 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ocean-500"
    >
      <span className="relative block aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-[1.07]"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ocean-700 shadow-sm">
            {product.badge}
          </span>
        )}
        <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-aqua-400/25 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      </span>

      <span className="flex flex-1 flex-col gap-1.5 bg-gradient-to-b from-ocean-50 to-ocean-100 p-4 text-left">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ocean-600 sm:text-[10px] sm:tracking-[0.18em]">
          {product.type}
        </span>

        <span className="flex items-end justify-between gap-2">
          <span className="text-[15px] font-bold leading-tight text-ink">{product.name}</span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-ocean-600 shadow-card transition-all duration-300 group-hover:bg-aqua-500 group-hover:text-navy-950">
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </span>

        <span className="mt-auto flex items-center justify-between gap-2 pt-1.5">
          <span className="text-[14px] font-bold text-navy-950">
            {formatPrice(product.price)}
          </span>
          <span className="flex items-center gap-1 text-[11.5px] font-semibold text-ocean-700">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
          </span>
        </span>
      </span>
    </Link>
  );
}
