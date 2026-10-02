"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Heart,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import type { Product, ProductCategory } from "@/types";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import { useCart } from "@/providers/CartProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import { reviews as siteReviews } from "@/data/reviews";
import { Rating } from "@/components/ui/Rating";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { StaggerContainer, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";

const categoryNames: Record<ProductCategory, string> = {
  fish: "Live Fish",
  tanks: "Aquarium Tanks",
  plants: "Aquatic Plants",
  food: "Fish Food",
  equipment: "Filters & Equipment",
  accessories: "Accessories",
};

type Tab = "description" | "specs" | "care" | "reviews";

const tabs: { id: Tab; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "specs", label: "Specifications" },
  { id: "care", label: "Care guide" },
  { id: "reviews", label: "Reviews" },
];

interface Props {
  product: Product;
  related: Product[];
}

export function ProductDetails({ product, related }: Props) {
  const router = useRouter();
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<Tab>("description");
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });

  const wished = has(product.slug);
  const saved = discountPercent(product.price, product.oldPrice);
  const gallery = product.images.length ? product.images : [product.image];
  const unavailable = product.stockState === "unavailable";

  const productReviews = useMemo(() => {
    const offset = product.name.length % siteReviews.length;
    return [...siteReviews.slice(offset), ...siteReviews.slice(0, offset)].slice(0, 3);
  }, [product.name]);

  const handleAdd = (goToCart = false) => {
    if (state === "loading") return;
    setState("loading");
    window.setTimeout(() => {
      add(product, qty);
      setState("success");
      if (goToCart) {
        router.push("/cart");
        return;
      }
      window.setTimeout(() => setState("idle"), 1200);
    }, 340);
  };

  return (
    <div className="pb-24">
      <div className="container-x pb-10 pt-[110px]">
        <nav
          aria-label="Breadcrumb"
          className="-mx-2 flex flex-wrap items-center gap-1 text-[13px] text-slate-500"
        >
          <Link href="/" className="flex min-h-[40px] items-center px-2 transition hover:text-ocean-600">
            Home
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/shop" className="flex min-h-[40px] items-center px-2 transition hover:text-ocean-600">
            Shop
          </Link>
          <span className="text-slate-300">/</span>
          <Link
            href={`/shop?category=${product.category}`}
            className="flex min-h-[40px] items-center px-2 transition hover:text-ocean-600"
          >
            {categoryNames[product.category]}
          </Link>
          <span className="text-slate-300">/</span>
          <span className="flex min-h-[40px] items-center px-2 text-navy-950">{product.name}</span>
        </nav>

        <div className="mt-7 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col gap-4">
            <div
              className="group relative aspect-square overflow-hidden rounded-3xl border border-slate-100 bg-mist shadow-card"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setZoom({
                  on: true,
                  x: ((e.clientX - rect.left) / rect.width) * 100,
                  y: ((e.clientY - rect.top) / rect.height) * 100,
                });
              }}
              onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
              data-cursor="media"
            >
              <AnimatePresenceGallery images={gallery} active={activeImg} zoom={zoom} />

              {product.badge && (
                <span className="absolute left-5 top-5 rounded-full bg-navy-900/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
                  {product.badge}
                </span>
              )}
              {saved && (
                <span className="absolute right-5 top-5 rounded-full bg-rose-500 px-3.5 py-1.5 text-[12px] font-bold text-white shadow">
                  -{saved}%
                </span>
              )}
            </div>

            <div className="flex gap-3">
              {gallery.map((src, index) => (
                <button
                  key={src + index}
                  type="button"
                  onClick={() => setActiveImg(index)}
                  aria-label={`View image ${index + 1}`}
                  className={cn(
                    "relative h-20 w-20 overflow-hidden rounded-2xl border-2 transition",
                    activeImg === index
                      ? "border-ocean-500 shadow-glow"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="eyebrow">{product.type}</p>
              <h1 className="mt-2.5 text-[32px] font-bold leading-[1.12] tracking-[-0.02em] text-navy-950 sm:text-[40px]">
                {product.name}
              </h1>
              <div className="mt-3.5 flex flex-wrap items-center gap-4">
                <Rating rating={product.rating} reviews={product.reviews} showValue size={16} />
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[13px] font-semibold",
                    product.stockState === "in-stock" && "bg-emerald-50 text-emerald-600",
                    product.stockState === "low-stock" && "bg-amber-50 text-amber-600",
                    product.stockState === "unavailable" && "bg-slate-100 text-slate-500"
                  )}
                >
                  {product.stockLabel}
                </span>
                {product.isLiveFish && (
                  <span className="rounded-full bg-aqua-500/15 px-3 py-1 text-[13px] font-semibold text-aqua-600">
                    Live fish — quarantined
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-baseline gap-3 rounded-2xl bg-mist px-5 py-4">
              <span className="text-[32px] font-bold text-navy-950">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-[17px] text-slate-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            <p className="text-[16px] leading-relaxed text-slate-600">{product.description}</p>

            <div className="flex flex-wrap items-center gap-4">
              <QuantityStepper
                value={qty}
                onChange={setQty}
                max={Math.max(1, product.stock)}
                ariaLabel={`Quantity of ${product.name}`}
              />
              <button
                type="button"
                onClick={() => handleAdd(false)}
                disabled={unavailable || state === "loading"}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300",
                  state === "success" ? "bg-emerald-500" : "bg-ocean-600 hover:bg-ocean-500 hover:shadow-glow"
                )}
              >
                {state === "success" ? (
                  <>
                    <Check size={17} /> Added to cart
                  </>
                ) : state === "loading" ? (
                  "Adding…"
                ) : (
                  <>
                    <ShoppingBag size={17} /> Add to cart
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => toggle(product.slug, product.name)}
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wished}
                className={cn(
                  "flex h-[52px] w-[52px] items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-0.5",
                  wished
                    ? "border-rose-200 bg-rose-50 text-rose-500"
                    : "border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:text-rose-500"
                )}
              >
                <Heart size={19} className={wished ? "fill-rose-500" : ""} />
              </button>
            </div>

            {!unavailable && (
              <button
                type="button"
                onClick={() => handleAdd(true)}
                className="w-full rounded-full border border-ocean-200 bg-white py-3.5 text-[15px] font-semibold text-ocean-700 transition hover:-translate-y-0.5 hover:border-ocean-400 hover:bg-ocean-50"
              >
                Buy it now
              </button>
            )}

            <ul className="grid gap-3 rounded-2xl border border-slate-100 bg-white p-5 text-[14px] text-slate-600 shadow-card sm:grid-cols-2">
              <li className="flex items-start gap-2.5">
                <Truck size={16} className="mt-0.5 shrink-0 text-ocean-600" />
                Free delivery over LKR 25,000
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-ocean-600" />
                {product.isLiveFish
                  ? "Live arrival guarantee"
                  : "Genuine quality guarantee"}
              </li>
              <li className="flex items-start gap-2.5">
                <PackageCheck size={16} className="mt-0.5 shrink-0 text-ocean-600" />
                Oxygen-packed, insured packaging
              </li>
              <li className="flex items-start gap-2.5">
                <RotateCcw size={16} className="mt-0.5 shrink-0 text-ocean-600" />
                7-day easy returns on gear
              </li>
            </ul>

            <dl className="flex flex-col gap-2.5 text-[14.5px]">
              <div className="flex gap-3">
                <dt className="w-32 shrink-0 text-slate-400">Category</dt>
                <dd>
                  <Link
                    href={`/shop?category=${product.category}`}
                    className="font-medium text-ocean-700 hover:underline"
                  >
                    {categoryNames[product.category]}
                  </Link>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-32 shrink-0 text-slate-400">SKU</dt>
                <dd className="font-medium text-navy-950">
                  AQL-{product.id.slice(0, 10).toUpperCase()}
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-32 shrink-0 text-slate-400">Availability</dt>
                <dd className="font-medium text-navy-950">
                  {unavailable ? "Back soon" : `${product.stock} in stock`}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <section className="container-x">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card sm:p-8">
          <div
            className="flex gap-1 overflow-x-auto border-b border-slate-100 pb-px no-scrollbar"
            role="tablist"
            aria-label="Product information"
          >
            {tabs.map((item) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={tab === item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "relative whitespace-nowrap px-4 py-3 text-[15px] font-semibold transition-colors",
                  tab === item.id ? "text-ocean-700" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {item.label}
                {tab === item.id && (
                  <motion.span
                    layoutId="product-tab"
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-ocean-600"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="pt-7">
            {tab === "description" && (
              <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
                <div className="flex flex-col gap-4 text-[15.5px] leading-relaxed text-slate-600">
                  <p>{product.description}</p>
                  <p>
                    Every {product.name.toLowerCase()} is selected by our team in Colombo and
                    packed for the journey to your door. Need help with setup? Our aquarists are a
                    message away — just reach out on WhatsApp or visit the store.
                  </p>
                  <ul className="flex flex-col gap-2 pt-1 text-[14.5px]">
                    {[
                      "Sourced from trusted breeders and farms",
                      "Checked for health, colour and vitality before dispatch",
                      "Backed by aquarium.lk support after purchase",
                    ].map((line) => (
                      <li key={line} className="flex items-start gap-2.5">
                        <Check size={16} className="mt-0.5 shrink-0 text-ocean-600" /> {line}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-mist p-6">
                  <h4 className="text-[13px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    At a glance
                  </h4>
                  <dl className="mt-4 flex flex-col gap-3 text-[14.5px]">
                    {(product.specs ?? []).slice(0, 4).map((spec) => (
                      <div key={spec.label} className="flex justify-between gap-4 border-b border-white/70 pb-2.5">
                        <dt className="text-slate-500">{spec.label}</dt>
                        <dd className="text-right font-semibold text-navy-950">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {tab === "specs" && (
              <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {(product.specs ?? []).map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-baseline justify-between gap-4 border-b border-dashed border-slate-100 pb-3"
                  >
                    <dt className="text-[14.5px] text-slate-500">{spec.label}</dt>
                    <dd className="text-[15px] font-semibold text-navy-950">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {tab === "care" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {(product.care ?? []).map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-100 bg-white p-5">
                    <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-ocean-600">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-[15.5px] font-semibold text-navy-950">{item.value}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === "reviews" && (
              <div className="grid gap-8 md:grid-cols-[260px_1fr]">
                <div className="flex flex-col items-start gap-3 rounded-2xl bg-mist p-6">
                  <span className="text-[44px] font-bold leading-none text-navy-950">
                    {product.rating.toFixed(1)}
                  </span>
                  <Rating rating={product.rating} size={16} />
                  <p className="text-[14px] text-slate-500">
                    Based on {product.reviews} customer ratings
                  </p>
                  <div className="mt-1 flex w-full flex-col gap-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const width = star === 5 ? 78 : star === 4 ? 16 : star === 3 ? 4 : 1;
                      return (
                        <div key={star} className="flex items-center gap-2.5 text-[12.5px] text-slate-500">
                          <span className="w-3">{star}</span>
                          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                            <span
                              className="block h-full rounded-full bg-amber-400"
                              style={{ width: `${width}%` }}
                            />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <span className="self-start rounded-full bg-amber-50 px-3.5 py-1.5 text-[12.5px] font-semibold text-amber-600 ring-1 ring-amber-200">
                    Demo reviews — prototype content
                  </span>
                  {productReviews.map((review) => (
                    <article
                      key={review.id}
                      className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5"
                    >
                      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-mist ring-2 ring-ocean-100">
                        <Image src={review.avatar} alt={review.name} fill sizes="44px" className="object-cover" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <p className="text-[15px] font-semibold text-navy-950">{review.name}</p>
                          <p className="text-[13px] text-slate-400">{review.location}</p>
                          <span className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={13}
                                className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                              />
                            ))}
                          </span>
                        </div>
                        <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{review.text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container-x mt-24">
        <SectionHeading
          eyebrow="Keep exploring"
          title="You may also like"
          action={
            <Link
              href={`/shop?category=${product.category}`}
              className="hidden items-center gap-1.5 text-[15px] font-semibold text-ocean-700 hover:text-ocean-500 sm:inline-flex"
            >
              <ArrowLeft size={15} /> Back to {categoryNames[product.category]}
            </Link>
          }
        />
        <StaggerContainer className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {related.map((item) => (
            <StaggerItem key={item.id}>
              <ProductCard product={item} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    </div>
  );
}

function AnimatePresenceGallery({
  images,
  active,
  zoom,
}: {
  images: string[];
  active: number;
  zoom: { on: boolean; x: number; y: number };
}) {
  return (
    <>
      {images.map((src, index) => (
        <motion.div
          key={src + index}
          initial={false}
          animate={{
            opacity: index === active ? 1 : 0,
            scale: index === active ? (zoom.on ? 1.8 : 1) : 1.04,
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
          style={{ transformOrigin: `${zoom.x}% ${zoom.y}%` }}
          aria-hidden={index !== active}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={index === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      ))}
    </>
  );
}
