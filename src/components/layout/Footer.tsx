"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Bubbles } from "@/components/effects/Bubbles";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const customerCare = [
  { label: "Shipping Policy", href: "/contact" },
  { label: "Returns", href: "/contact" },
  { label: "FAQ", href: "/contact" },
  { label: "Support", href: "/contact" },
];

function Facebook({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.3 0-1.3-.13-2.47-.13-2.45 0-4.13 1.5-4.13 4.24V9.9H7.4V13h2.7v8h3.4Z" />
    </svg>
  );
}
function Instagram({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function XSocial({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M17.6 3h3.2l-7 8L22 21h-6.3l-4.4-5.7L6.1 21H2.9l7.5-8.6L2.4 3h6.5l4 5.3L17.6 3Zm-1.1 16.1h1.8L7.7 4.8H5.8l10.7 14.3Z" />
    </svg>
  );
}
function Youtube({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2c-.23-.9-.9-1.6-1.8-1.84C18.25 5 12 5 12 5s-6.25 0-7.8.36c-.9.24-1.57.94-1.8 1.84C2 8.8 2 12 2 12s0 3.2.4 4.8c.23.9.9 1.6 1.8 1.84C5.75 19 12 19 12 19s6.25 0 7.8-.36c-.9-.24 1.57-.94 1.8-1.84.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
    </svg>
  );
}

const socials = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: XSocial, label: "X (Twitter)", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(1000px_400px_at_15%_0%,rgba(30,144,240,0.22),transparent_65%)]" />
      <Bubbles count={10} className="opacity-40" />

      <div className="container-x relative z-10 pb-8 pt-16 sm:pt-20">
        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-5">
            <Logo light />
            <p className="max-w-xs text-[15px] leading-relaxed text-white/60">
              Sri Lanka&apos;s premium destination for healthy fish, beautiful aquariums and everything
              your underwater world needs.
            </p>
            <p className="text-[13px] font-semibold tracking-[0.16em] text-aqua-400/90">
              Nature in Every Drop.
            </p>
            <div className="flex gap-2.5">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:bg-ocean-500 hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Quick Links" links={quickLinks} />
          <FooterColumn title="Customer Care" links={customerCare} />

          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.18em] text-aqua-400">
              Contact Us
            </h3>
            <ul className="mt-5 flex flex-col gap-4 text-[15px] text-white/70">
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-1 shrink-0 text-ocean-400" />
                <span>+94 77 456 4567</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-1 shrink-0 text-ocean-400" />
                <span>hello@aquarium.lk</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 shrink-0 text-ocean-400" />
                <span>42 Marine Drive, Colombo 03, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-7 text-[13px] text-white/45 sm:flex-row">
          <p>© 2026 aquarium.lk — All rights reserved.</p>
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-6">
            <Link href="/contact" className="flex min-h-[44px] items-center px-2 transition hover:text-white lg:min-h-0 lg:px-0">
              Privacy Policy
            </Link>
            <Link href="/contact" className="flex min-h-[44px] items-center px-2 transition hover:text-white lg:min-h-0 lg:px-0">
              Terms &amp; Conditions
            </Link>
            <a
              href="#top"
              className="group flex min-h-[44px] items-center gap-1.5 rounded-full bg-white/8 px-4 transition hover:bg-ocean-500 hover:text-white lg:min-h-0 lg:py-1.5"
            >
              Back to top
              <ArrowUpRight size={13} className="transition group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-[13px] font-bold uppercase tracking-[0.18em] text-aqua-400">{title}</h3>
      <ul className="mt-4 flex flex-col gap-1 sm:mt-5 sm:gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group inline-flex min-h-[44px] items-center gap-1.5 py-1 text-[15px] text-white/65 transition hover:text-white lg:min-h-0"
            >
              <span className="h-px w-0 bg-aqua-400 transition-all duration-300 group-hover:w-4" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
