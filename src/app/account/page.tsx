"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, MapPin, Package, Wallet } from "lucide-react";
import { demoOrders, demoAddresses } from "@/data/orders";
import { useWishlist } from "@/providers/WishlistProvider";
import { useCart } from "@/providers/CartProvider";
import { formatPrice, cn } from "@/lib/utils";
import { statusLabel } from "@/lib/orderStatus";

export default function AccountOverviewPage() {
  const { items } = useWishlist();
  const { count } = useCart();
  const recent = demoOrders.slice(0, 2);
  const spent = demoOrders.reduce((sum, order) => sum + order.total, 0);
  const defaultAddress = demoAddresses.find((a) => a.isDefault) ?? demoAddresses[0];

  const stats = [
    { icon: Package, label: "Orders placed", value: String(demoOrders.length) },
    { icon: Heart, label: "Wishlist items", value: String(items.length) },
    { icon: Wallet, label: "Total spent", value: formatPrice(spent) },
    { icon: MapPin, label: "Saved addresses", value: String(demoAddresses.length) },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="eyebrow">Account overview</p>
        <h1 className="mt-2 text-[30px] font-bold tracking-[-0.02em] text-navy-950">
          Good to see you again
        </h1>
        <p className="mt-2 text-[15.5px] text-slate-500">
          {count > 0
            ? `You have ${count} item${count === 1 ? "" : "s"} waiting in your cart.`
            : "Everything you need to manage orders, saved items and deliveries."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card-base flex flex-col gap-3 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600">
              <stat.icon size={18} />
            </span>
            <span className="text-[22px] font-bold tracking-[-0.01em] text-navy-950">
              {stat.value}
            </span>
            <span className="text-[13.5px] text-slate-500">{stat.label}</span>
          </div>
        ))}
      </div>

      <section className="card-base p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[17px] font-bold text-navy-950">Recent orders</h2>
          <Link
            href="/account/orders"
            className="group inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ocean-700 hover:text-ocean-500"
          >
            All orders
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <ul className="mt-5 flex flex-col gap-4">
          {recent.map((order) => (
            <li
              key={order.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 sm:flex-row sm:items-center"
            >
              <div className="flex -space-x-3">
                {order.items.slice(0, 3).map((item) => (
                  <span
                    key={item.name}
                    className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-mist"
                  >
                    <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                  </span>
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-navy-950">{order.id}</p>
                <p className="text-[13.5px] text-slate-400">
                  {order.date} · {order.items.length} items
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1.5 text-[13px] font-semibold",
                  statusLabel(order.status).className
                )}
              >
                {statusLabel(order.status).label}
              </span>
              <span className="text-[16px] font-bold text-navy-950">{formatPrice(order.total)}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card-base flex items-start gap-4 p-6">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-aqua-500/15 text-aqua-600">
            <MapPin size={19} />
          </span>
          <div className="min-w-0">
            <p className="text-[15.5px] font-semibold text-navy-950">Default address</p>
            <p className="mt-1 text-[14.5px] leading-relaxed text-slate-500">
              {defaultAddress.line1}, {defaultAddress.city}
            </p>
            <Link
              href="/account/addresses"
              className="mt-2 inline-block text-[14px] font-semibold text-ocean-700 hover:underline"
            >
              Manage addresses
            </Link>
          </div>
        </div>

        <div className="card-base flex items-start gap-4 p-6">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600">
            <Package size={19} />
          </span>
          <div>
            <p className="text-[15.5px] font-semibold text-navy-950">Need something new?</p>
            <p className="mt-1 text-[14.5px] leading-relaxed text-slate-500">
              Fresh livestock lands every week — take a look at what just arrived.
            </p>
            <Link
              href="/shop"
              className="mt-2 inline-block text-[14px] font-semibold text-ocean-700 hover:underline"
            >
              Browse the shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
