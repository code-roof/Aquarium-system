"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Search, Sparkles, X, SearchX } from "lucide-react";
import { products, searchProducts } from "@/data/products";
import { useUI } from "@/providers/UIProvider";
import { formatPrice } from "@/lib/utils";

const popularTerms = ["Neon Tetra", "Betta", "Rimless tank", "Canister filter", "Java fern"];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUI();
  const [term, setTerm] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("aquarium-lk-recent");
      if (raw) setRecent(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (searchOpen) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(t);
    }
    setTerm("");
  }, [searchOpen]);

  const results = useMemo(() => (term.trim() ? searchProducts(term) : []), [term]);
  const trending = useMemo(() => products.filter((p) => p.featured).slice(0, 5), []);

  const commit = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    const next = [clean, ...recent.filter((r) => r !== clean)].slice(0, 5);
    setRecent(next);
    window.localStorage.setItem("aquarium-lk-recent", JSON.stringify(next));
    setSearchOpen(false);
    router.push(`/shop?search=${encodeURIComponent(clean)}`);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[85] flex items-start justify-center overflow-y-auto bg-navy-950/70 px-4 pb-10 pt-[12vh] backdrop-blur-md"
          onClick={() => setSearchOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
        >
          <motion.div
            initial={{ opacity: 0, y: -28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.98 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                commit(term);
              }}
              className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6"
            >
              <Search size={20} className="shrink-0 text-ocean-500" />
              <input
                ref={inputRef}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search fish, tanks, plants, equipment…"
                aria-label="Search products"
                className="w-full bg-transparent text-[17px] text-ink outline-none placeholder:text-slate-400"
              />
              <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-400 sm:block">
                ESC
              </kbd>
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-mist text-slate-500 transition hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </form>

            <div className="max-h-[62vh] overflow-y-auto px-5 py-5 sm:px-6">
              {!term.trim() && (
                <div className="flex flex-col gap-6">
                  {recent.length > 0 && (
                    <div>
                      <p className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        <Clock size={13} /> Recent searches
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r) => (
                          <button
                            key={r}
                            onClick={() => commit(r)}
                            className="rounded-full border border-slate-200 px-3.5 py-1.5 text-[13px] text-slate-600 transition hover:border-ocean-300 hover:bg-ocean-50 hover:text-ocean-700"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      <Sparkles size={13} /> Popular right now
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {popularTerms.map((t) => (
                        <button
                          key={t}
                          onClick={() => commit(t)}
                          className="rounded-full border border-slate-200 px-3.5 py-1.5 text-[13px] text-slate-600 transition hover:border-ocean-300 hover:bg-ocean-50 hover:text-ocean-700"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Trending products
                    </p>
                    <ul className="flex flex-col gap-1">
                      {trending.map((p) => (
                        <li key={p.id}>
                          <SearchRow
                            href={`/product/${p.slug}`}
                            image={p.image}
                            name={p.name}
                            meta={p.type}
                            price={formatPrice(p.price)}
                            onClick={() => setSearchOpen(false)}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {term.trim() && results.length > 0 && (
                <div>
                  <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    {results.length} result{results.length > 1 ? "s" : ""}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {results.map((p) => (
                      <li key={p.id}>
                        <SearchRow
                          href={`/product/${p.slug}`}
                          image={p.image}
                          name={p.name}
                          meta={p.type}
                          price={formatPrice(p.price)}
                          onClick={() => setSearchOpen(false)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {term.trim() && results.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mist text-ocean-500">
                    <SearchX size={24} />
                  </span>
                  <p className="text-lg font-bold text-navy-950">No fish found.</p>
                  <p className="max-w-xs text-sm text-slate-500">
                    Try a different species, tank size or brand name.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-mist px-5 py-3.5 text-[12px] text-slate-500 sm:px-6">
              <span>Press Enter to see all results</span>
              <span className="hidden sm:block">aquarium.lk search</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SearchRow({
  href,
  image,
  name,
  meta,
  price,
  onClick,
}: {
  href: string;
  image: string;
  name: string;
  meta: string;
  price: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-4 rounded-2xl px-3 py-3 transition hover:bg-ocean-50"
    >
      <span className="relative block h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-mist">
        <Image src={image} alt={name} fill sizes="64px" className="object-cover" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-navy-950">{name}</span>
        <span className="block text-[13px] text-slate-400">{meta}</span>
      </span>
      <span className="text-[14px] font-bold text-ocean-700">{price}</span>
    </Link>
  );
}
