"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useCart } from "@/providers/CartProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import { useUI } from "@/providers/UIProvider";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { count, lastAdded } = useCart();
  const { items } = useWishlist();
  const { setSearchOpen, setMenuOpen } = useUI();

  const bare = pathname === "/login" || pathname === "/register";

  // Routes whose top band is dark (bg-navy-950) need the light navbar treatment,
  // otherwise the dark link/icon colours are invisible against the blue.
  const darkTop = pathname === "/" || pathname.startsWith("/product") || pathname === "/shop" || pathname === "/about" || pathname === "/contact";

  const onHero = !scrolled && darkTop;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (bare) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-[60] transition-all duration-500 ease-smooth">
      <div
        className={cn(
          "transition-all duration-500 ease-smooth",
          onHero
            ? "border-b border-white/10 bg-navy-950/25 backdrop-blur-md"
            : scrolled
              ? "border-b border-slate-100 bg-white/90 shadow-[0_10px_30px_-24px_rgba(4,32,53,0.6)] backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="container-x flex h-[76px] items-center justify-between gap-3 sm:gap-6">
          <Link href="/" aria-label="aquarium.lk home" className="min-w-0 shrink">
            <Logo light={onHero} />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  data-active={active}
                  className={cn("nav-link", onHero ? "text-white" : "text-navy-950/80 hover:text-ocean-700")}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <IconBtn
              label="Search products"
              light={onHero}
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex"
            >
              <Search size={18} />
            </IconBtn>

            <Link href="/account/wishlist" aria-label={`Wishlist, ${items.length} items`}>
              <IconLink light={onHero} badge={items.length} className="hidden sm:flex">
                <Heart size={18} />
              </IconLink>
            </Link>

            <Link href="/cart" aria-label={`Cart, ${count} items`}>
              <IconLink light={onHero} badge={count} id="cart-indicator" pulse={Boolean(lastAdded)}>
                <ShoppingBag size={18} />
              </IconLink>
            </Link>

            <Link href="/account" aria-label="Account">
              <IconLink light={onHero} className="hidden sm:flex">
                <User size={18} />
              </IconLink>
            </Link>

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition lg:hidden",
                onHero ? "bg-white/12 text-white" : "bg-mist text-navy-950"
              )}
            >
              <Menu size={19} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function iconClasses(light?: boolean, className?: string) {
  return cn(
    "relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-105",
    light ? "bg-white/12 text-white hover:bg-white/20" : "bg-mist text-navy-950 hover:bg-ocean-50",
    className
  );
}

function Badge({ count, pulse }: { count?: number; pulse?: boolean }) {
  return (
    <>
      {pulse && <span className="absolute inset-0 animate-pulseRing rounded-full bg-aqua-400/50" />}
      {typeof count === "number" && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-aqua-500 px-1 text-[10px] font-bold text-navy-950 shadow">
          {count}
        </span>
      )}
    </>
  );
}

function IconLink({
  children,
  badge,
  light,
  className,
  id,
  pulse,
}: {
  children: React.ReactNode;
  badge?: number;
  light?: boolean;
  className?: string;
  id?: string;
  pulse?: boolean;
}) {
  return (
    <span id={id} className={iconClasses(light, className)}>
      {children}
      <Badge count={badge} pulse={pulse} />
    </span>
  );
}

function IconBtn({
  children,
  label,
  light,
  onClick,
  className,
}: {
  children: React.ReactNode;
  label: string;
  light?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className={iconClasses(light, className)}>
      {children}
    </button>
  );
}

export function MobileMenu() {
  const { menuOpen, setMenuOpen, setSearchOpen } = useUI();
  const pathname = usePathname();

  useEffect(() => setMenuOpen(false), [pathname, setMenuOpen]);

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <AnimatePresence>
      {menuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-[70] bg-navy-950/60 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-[71] flex h-full w-[86%] max-w-sm flex-col bg-navy-950 text-white shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <Logo light />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
              >
                <span className="text-lg leading-none">&times;</span>
              </button>
            </div>

            <nav className="flex flex-col gap-1 px-4 py-6" aria-label="Mobile">
              {links.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center justify-between rounded-2xl px-4 py-4 text-lg font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
                  >
                    {link.label}
                    <span className="text-aqua-400">&rarr;</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto space-y-3 border-t border-white/10 p-6">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-3.5 text-sm font-semibold"
              >
                <Search size={16} /> Search the store
              </button>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-3 text-sm font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 rounded-full bg-ocean-500 px-4 py-3 text-sm font-semibold text-white"
                >
                  Register
                </Link>
              </div>
              <p className="pt-2 text-center text-[12px] text-white/40">
                Nature in Every Drop — aquarium.lk
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
