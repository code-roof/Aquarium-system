"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Pencil,
} from "lucide-react";
import { demoUser } from "@/data/orders";
import { authService } from "@/services/authService";
import { useWishlist } from "@/providers/WishlistProvider";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/account", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "My orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
];

export function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useWishlist();
  const [user, setUser] = useState(demoUser);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("aquarium-lk-user");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const signOut = async () => {
    await authService.signOut();
    window.localStorage.removeItem("aquarium-lk-user");
    router.push("/");
  };

  return (
    <div className="container-x pb-24 pt-[120px]">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <aside className="lg:w-72 lg:shrink-0">
          <div className="sticky top-24 flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-ocean-500 to-ocean-700 text-[18px] font-bold text-white shadow-glow">
                {user.initials ?? user.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[16px] font-bold text-navy-950">
                  {user.name}
                </span>
                <span className="block truncate text-[13.5px] text-slate-400">{user.email}</span>
              </span>
            </div>

            <nav className="flex flex-col gap-1" aria-label="Account">
              {nav.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-[14.5px] font-medium transition",
                      active
                        ? "bg-ocean-50 text-ocean-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-navy-950"
                    )}
                  >
                    <item.icon size={17} />
                    <span className="flex-1">{item.label}</span>
                    {item.href === "/account/wishlist" && items.length > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-aqua-500 px-1.5 text-[11px] font-bold text-navy-950">
                        {items.length}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-[14.5px] font-medium text-slate-600 transition hover:bg-slate-50"
                onClick={() => undefined}
              >
                <Pencil size={16} /> Edit profile
              </button>
              <button
                type="button"
                onClick={signOut}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-[14.5px] font-medium text-rose-500 transition hover:bg-rose-50"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
