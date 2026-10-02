import Link from "next/link";
import { Compass, Fish, Search } from "lucide-react";
import { Bubbles } from "@/components/effects/Bubbles";
import { LightRays } from "@/components/effects/LightRays";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-navy-950 px-6 pt-[76px] text-center">
      <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_110%,rgba(30,144,240,0.35),transparent_65%)]" />
      <LightRays className="opacity-50" />
      <Bubbles count={20} density="medium" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white/8 text-aqua-400 ring-1 ring-white/15">
          <Fish size={42} />
        </span>

        <p className="text-[13px] font-bold uppercase tracking-[0.4em] text-aqua-400">404</p>

        <h1 className="max-w-2xl text-balance text-[36px] font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-[52px]">
          This page swam away
        </h1>

        <p className="max-w-md text-[16.5px] leading-relaxed text-white/60">
          The link you followed doesn&apos;t exist in our tank. Let&apos;s get you back to something
          alive and swimming.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="btn-primary group">
            Back to home
          </Link>
          <Link href="/shop" className="btn-ghost">
            <Search size={16} /> Browse the shop
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2.5 text-[13.5px] text-white/45">
          <span className="rounded-full border border-white/12 px-4 py-1.5">
            <Compass size={13} className="mr-1.5 inline" /> Try the search button in the navbar
          </span>
          <span className="rounded-full border border-white/12 px-4 py-1.5">
            Popular: Live Fish · Rimless Tanks · Canister Filters
          </span>
        </div>
      </div>
    </section>
  );
}
