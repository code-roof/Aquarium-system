"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LayoutGrid,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { products, searchProducts } from "@/data/products";
import { categories } from "@/data/categories";
import type { Product, ProductCategory } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/product/ProductCard";
import { GridSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

type CategoryFilter = ProductCategory | "all";
type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

const sorts: { label: string; value: SortKey }[] = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Newest", value: "newest" },
];

const maxPrice = Math.ceil(Math.max(...products.map((p) => p.price)) / 1000) * 1000;
const PAGE_SIZE = 12;

interface Props {
  initialCategory: string;
  initialSearch: string;
  initialSort: string;
}

export function ShopClient({ initialCategory, initialSearch, initialSort }: Props) {
  const router = useRouter();
  const [category, setCategory] = useState<CategoryFilter>(
    (categories.some((c) => c.slug === initialCategory)
      ? initialCategory
      : "all") as CategoryFilter
  );
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [sort, setSort] = useState<SortKey>(
    sorts.some((s) => s.value === initialSort) ? (initialSort as SortKey) : "featured"
  );
  const [priceCap, setPriceCap] = useState(maxPrice);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [ratingMin, setRatingMin] = useState(0);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search), 280);
    return () => window.clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    setVisible(PAGE_SIZE);
    const t = window.setTimeout(() => setLoading(false), 320);
    return () => window.clearTimeout(t);
  }, [category, debouncedSearch, sort, priceCap, inStockOnly, ratingMin]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (sort !== "featured") params.set("sort", sort);
    const qs = params.toString();
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  }, [category, debouncedSearch, sort, router]);

  // Keep state in sync when the shop is navigated to from elsewhere
  // (e.g. the Navbar "Shop" link and category cards) without a full page reload.
  useEffect(() => {
    setCategory(
      (categories.some((c) => c.slug === initialCategory) ? initialCategory : "all") as CategoryFilter
    );
    setSearch(initialSearch);
    setDebouncedSearch(initialSearch);
    setSort(sorts.some((s) => s.value === initialSort) ? (initialSort as SortKey) : "featured");
  }, [initialCategory, initialSearch, initialSort]);

  const filtered = useMemo(() => {
    let list = products;

    if (category !== "all") list = list.filter((p) => p.category === category);
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase();
      const matched = searchProducts(q).map((p) => p.id);
      list = list.filter(
        (p) =>
          matched.includes(p.id) ||
          p.name.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (priceCap < maxPrice) list = list.filter((p) => p.price <= priceCap);
    if (inStockOnly) list = list.filter((p) => p.stockState !== "unavailable");
    if (ratingMin > 0) list = list.filter((p) => p.rating >= ratingMin);

    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
      case "newest":
        sorted.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        break;
      default:
        sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    }
    return sorted;
  }, [category, debouncedSearch, sort, priceCap, inStockOnly, ratingMin]);

  const activeCategory = categories.find((c) => c.slug === category);
  const hasFilters =
    category !== "all" || Boolean(debouncedSearch) || priceCap < maxPrice || inStockOnly || ratingMin > 0;

  const clearAll = () => {
    setCategory("all");
    setSearch("");
    setDebouncedSearch("");
    setPriceCap(maxPrice);
    setInStockOnly(false);
    setRatingMin(0);
  };

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden bg-navy-950 pt-[116px]">
        <div className="container-x relative z-10 pb-12 pt-6">
          <nav
            aria-label="Breadcrumb"
            className="-mx-2 flex items-center gap-1 text-[13px] text-white/55"
          >
            <Link href="/" className="flex min-h-[40px] items-center px-2 transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="flex min-h-[40px] items-center px-2 transition hover:text-white">
              Shop
            </Link>
            {activeCategory && (
              <>
                <span>/</span>
                <span className="flex min-h-[40px] items-center px-2 text-aqua-300">
                  {activeCategory.name}
                </span>
              </>
            )}
          </nav>
          <h1 className="mt-4 text-[36px] font-bold tracking-[-0.02em] text-white sm:text-[46px]">
            {activeCategory ? activeCategory.name : "All products"}
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] text-white/60">
            {activeCategory
              ? activeCategory.description
              : "Browse 70+ products across fish, tanks, plants, food, equipment and accessories."}
          </p>
        </div>
      </section>

      <div className="container-x pt-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <aside
            className={cn(
              "lg:w-72 lg:shrink-0",
              filtersOpen ? "block" : "hidden lg:block"
            )}
            aria-label="Product filters"
          >
            <div className="sticky top-24 flex flex-col gap-7 rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-[15px] font-bold text-navy-950">
                  <SlidersHorizontal size={16} className="text-ocean-600" /> Filters
                </h2>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="flex items-center gap-1.5 text-[13px] font-semibold text-ocean-600 hover:text-ocean-500"
                  >
                    <RotateCcw size={13} /> Clear all
                  </button>
                )}
              </div>

              <FilterGroup title="Category">
                <ul className="flex flex-col gap-1.5">
                  {[{ name: "All Products", slug: "all" }, ...categories].map((item) => {
                    const count =
                      item.slug === "all"
                        ? products.length
                        : products.filter((p) => p.category === item.slug).length;
                    const activeFilter = category === item.slug;
                    return (
                      <li key={item.slug}>
                        <button
                          type="button"
                          onClick={() => setCategory(item.slug as CategoryFilter)}
                          className={cn(
                            "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[14.5px] transition",
                            activeFilter
                              ? "bg-ocean-50 font-semibold text-ocean-700"
                              : "text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            <span
                              className={cn(
                                "h-3.5 w-3.5 rounded-full border-[3px] transition",
                                activeFilter ? "border-ocean-600 bg-white" : "border-slate-200"
                              )}
                            />
                            {item.name}
                          </span>
                          <span className="text-[12.5px] text-slate-400">{count}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </FilterGroup>

              <FilterGroup title={`Max price`}>
                <input
                  type="range"
                  min={1000}
                  max={maxPrice}
                  step={500}
                  value={priceCap}
                  onChange={(e) => setPriceCap(Number(e.target.value))}
                  aria-label="Maximum price"
                  className="w-full accent-ocean-600"
                />
                <div className="mt-1 flex justify-between text-[13px] text-slate-500">
                  <span>LKR 1,000</span>
                  <span className="font-semibold text-navy-950">
                    {priceCap >= maxPrice ? formatPrice(maxPrice) : `Up to ${formatPrice(priceCap)}`}
                  </span>
                </div>
              </FilterGroup>

              <FilterGroup title="Availability">
                <label className="flex cursor-pointer items-center gap-3 text-[14.5px] text-slate-600">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 rounded accent-ocean-600"
                  />
                  In stock only
                </label>
              </FilterGroup>

              <FilterGroup title="Customer rating">
                <div className="flex flex-col gap-2">
                  {[0, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setRatingMin(rating)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-3 py-2 text-left text-[14px] transition",
                        ratingMin === rating
                          ? "bg-ocean-50 font-semibold text-ocean-700"
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {rating === 0 ? (
                        "Any rating"
                      ) : (
                        <>
                          <span className="flex items-center gap-0.5">
                            {rating}
                            <Star size={13} className="fill-amber-400 text-amber-400" />
                          </span>
                          <span>&amp; up</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </FilterGroup>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…"
                  aria-label="Search products"
                  className="field !py-2.5 !pl-10 !text-[14.5px]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFiltersOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-[14px] font-semibold text-navy-950 lg:hidden"
                >
                  <SlidersHorizontal size={15} /> {filtersOpen ? "Hide" : "Filters"}
                </button>

                <label className="relative">
                  <span className="sr-only">Sort by</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="appearance-none rounded-full border border-slate-200 bg-white py-2.5 pl-4 pr-9 text-[14px] font-semibold text-navy-950 outline-none transition hover:border-ocean-300"
                  >
                    {sorts.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </label>

                <span className="hidden items-center gap-1.5 rounded-full bg-mist px-3.5 py-2.5 text-[13.5px] font-medium text-slate-500 sm:flex">
                  <LayoutGrid size={14} /> {filtered.length} results
                </span>
              </div>
            </div>

            <div className="mt-6 min-h-[400px]">
              {loading ? (
                <GridSkeleton count={8} />
              ) : filtered.length === 0 ? (
                <EmptyState
                  icon={<SearchX size={30} />}
                  title="No products found."
                  description="Try a different search term, category or price range."
                  actionLabel="Clear filters"
                  onAction={clearAll}
                />
              ) : (
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={`${category}-${debouncedSearch}-${sort}-${priceCap}-${inStockOnly}-${ratingMin}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-4"
                  >
                    {filtered.slice(0, visible).map((product: Product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}

              {!loading && filtered.length > visible && (
                <div className="mt-12 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="btn-outline"
                  >
                    Load more products ({filtered.length - visible} remaining)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {title}
      </h3>
      {children}
    </div>
  );
}
