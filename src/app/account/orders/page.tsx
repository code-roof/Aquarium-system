"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, PackageSearch, Truck } from "lucide-react";
import { demoOrders } from "@/data/orders";
import { orderTimeline } from "@/data/orders";
import { getOrderTimelineStep, cn, formatPrice } from "@/lib/utils";
import { statusLabel } from "@/lib/orderStatus";
import { EmptyState } from "@/components/ui/EmptyState";

export default function OrdersPage() {
  const [openId, setOpenId] = useState<string | null>(demoOrders[0]?.id ?? null);

  if (demoOrders.length === 0) {
    return (
      <EmptyState
        icon={<PackageSearch size={30} />}
        title="No orders yet."
        description="When you place an order it will appear here with live status updates."
        actionLabel="Start shopping"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="eyebrow">Order history</p>
        <h1 className="mt-2 text-[30px] font-bold tracking-[-0.02em] text-navy-950">My orders</h1>
        <p className="mt-2 text-[15.5px] text-slate-500">
          {demoOrders.length} demo orders — prototype content, not real purchases.
        </p>
      </div>

      <ul className="flex flex-col gap-4">
        {demoOrders.map((order) => {
          const open = openId === order.id;
          const stepIndex = getOrderTimelineStep(order.status);
          const config = statusLabel(order.status);

          return (
            <li key={order.id} className="card-base overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : order.id)}
                aria-expanded={open}
                className="flex w-full flex-col gap-4 p-5 text-left sm:flex-row sm:items-center"
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

                <span className="min-w-0 flex-1">
                  <span className="block text-[15.5px] font-bold text-navy-950">{order.id}</span>
                  <span className="block text-[13.5px] text-slate-400">
                    {order.date} · {order.items.length} items · {order.payment}
                  </span>
                </span>

                <span className={cn("rounded-full px-3 py-1.5 text-[13px] font-semibold", config.className)}>
                  {config.label}
                </span>

                <span className="text-[16px] font-bold text-navy-950">{formatPrice(order.total)}</span>

                <ChevronDown
                  size={17}
                  className={cn(
                    "shrink-0 text-slate-400 transition-transform duration-300",
                    open && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-slate-100 p-5">
                      <ol className="flex flex-col gap-0 sm:flex-row sm:items-start sm:justify-between">
                        {orderTimeline.map((stage, index) => {
                          const done = index <= stepIndex;
                          const current = index === stepIndex;
                          return (
                            <li key={stage.status} className="flex gap-3 sm:flex-1 sm:flex-col sm:gap-2">
                              <span className="flex items-center gap-3 sm:gap-0">
                                <span
                                  className={cn(
                                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition",
                                    done ? "bg-ocean-600 text-white" : "bg-slate-100 text-slate-400",
                                    current && "animate-pulseRing bg-ocean-500"
                                  )}
                                >
                                  {index + 1}
                                </span>
                                {index < orderTimeline.length - 1 && (
                                  <span
                                    className={cn(
                                      "h-0.5 w-8 sm:hidden",
                                      index < stepIndex ? "bg-ocean-500" : "bg-slate-100"
                                    )}
                                  />
                                )}
                              </span>
                              <span className="mb-4 sm:mb-0 sm:pr-4">
                                <span
                                  className={cn(
                                    "block text-[14px] font-semibold",
                                    done ? "text-navy-950" : "text-slate-400"
                                  )}
                                >
                                  {stage.label}
                                </span>
                                <span className="block text-[13px] text-slate-400">
                                  {stage.description}
                                </span>
                              </span>
                            </li>
                          );
                        })}
                      </ol>

                      <div className="mt-6 grid gap-5 rounded-2xl bg-mist p-5 lg:grid-cols-[1.4fr_1fr]">
                        <div>
                          <h4 className="text-[13px] font-bold uppercase tracking-[0.14em] text-slate-400">
                            Items
                          </h4>
                          <ul className="mt-3 flex flex-col gap-3">
                            {order.items.map((item) => (
                              <li key={item.name} className="flex items-center gap-3">
                                <span className="relative h-10 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                                  <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                                </span>
                                <span className="min-w-0 flex-1 truncate text-[14.5px] font-medium text-navy-950">
                                  {item.name}
                                </span>
                                <span className="text-[13.5px] text-slate-400">×{item.quantity}</span>
                                <span className="text-[14.5px] font-semibold text-navy-950">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-col gap-3 text-[14.5px]">
                          <div className="flex gap-3">
                            <span className="w-24 shrink-0 text-slate-400">Delivery</span>
                            <span className="text-navy-950">{order.address}</span>
                          </div>
                          <div className="flex gap-3">
                            <span className="w-24 shrink-0 text-slate-400">Estimate</span>
                            <span className="flex items-center gap-1.5 font-medium text-ocean-700">
                              <Truck size={14} /> {order.estimate}
                            </span>
                          </div>
                          <div className="flex gap-3">
                            <span className="w-24 shrink-0 text-slate-400">Total</span>
                            <span className="font-bold text-navy-950">{formatPrice(order.total)}</span>
                          </div>
                          <Link
                            href="/contact"
                            className="mt-2 self-start rounded-full border border-ocean-200 bg-white px-4 py-2 text-[14px] font-semibold text-ocean-700 transition hover:bg-ocean-50"
                          >
                            Need help with this order?
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
