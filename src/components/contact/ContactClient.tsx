"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useToast } from "@/providers/ToastProvider";
import { cn } from "@/lib/utils";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const contactCards = [
  { icon: Phone, title: "Call us", value: "+94 77 456 4567", detail: "Mon – Sat, 9:00 – 19:00" },
  { icon: Mail, title: "Email", value: "hello@aquarium.lk", detail: "Replies within 24 hours" },
  { icon: MapPin, title: "Flagship store", value: "42 Marine Drive", detail: "Colombo 03, Sri Lanka" },
  { icon: Clock, title: "Opening hours", value: "9:00 – 19:00", detail: "Sunday closed" },
];

const faqs = [
  {
    q: "Do you deliver live fish island-wide?",
    a: "Yes. Livestock is packed in oxygenated, temperature-stable bags and shipped with insulated packaging to every province. Delivery is free on orders over LKR 25,000.",
  },
  {
    q: "What is the live arrival guarantee?",
    a: "If any fish arrives unhealthy, send us a photo within 2 hours of delivery and we will replace it or refund it — your choice.",
  },
  {
    q: "Can you help me set up my first aquarium?",
    a: "Absolutely. Every tank purchase includes free setup guidance, and our team is available on WhatsApp through the cycling period of your tank.",
  },
  {
    q: "Do you take custom aquascape projects?",
    a: "We do — from nano desk tanks to office display systems. Mention your project in the contact form and we will get back to you with a plan.",
  },
];

export function ContactClient() {
  const { push } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "General enquiry", message: "" });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string | undefined> = {};
    if (form.name.trim().length < 3) next.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address";
    if (form.message.trim().length < 10) next.message = "Tell us a little more (10+ characters)";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSent(true);
    push({ title: "Message sent", description: "We'll reply within 24 hours" });
  };

  return (
    <>
      <section className="relative overflow-hidden bg-navy-950 pb-20 pt-[150px]">
        <div className="absolute inset-0 bg-[radial-gradient(700px_340px_at_75%_0%,rgba(30,144,240,0.35),transparent_70%)]" />
        <div className="container-x relative z-10">
          <Reveal>
            <span className="eyebrow text-aqua-400">Contact us</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-3 max-w-3xl text-[40px] font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-[52px]">
              Let&apos;s talk aquariums
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-4 max-w-xl text-[17px] text-white/65">
              Questions about a fish, a filter or a full aquascape project? Our team in Colombo is
              ready to help.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x -mt-10 relative z-10">
        <StaggerContainer className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {contactCards.map((card) => (
            <StaggerItem key={card.title}>
              <div className="card-base flex h-full flex-col gap-3 p-5 sm:p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600">
                  <card.icon size={19} />
                </span>
                <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  {card.title}
                </p>
                <p className="break-words text-[16px] font-bold text-navy-950">{card.value}</p>
                <p className="text-[13.5px] text-slate-500">{card.detail}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="container-x grid gap-12 py-24 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <SectionHeading
            eyebrow="Send a message"
            title="Tell us what you need"
            description="Fill in the form and our team will get back to you within one working day."
          />

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex flex-col items-start gap-4 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-8"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-emerald-500 shadow-card">
                  <CheckCircle2 size={28} />
                </span>
                <div>
                  <h3 className="text-[19px] font-bold text-navy-950">Message received</h3>
                  <p className="mt-1.5 max-w-md text-[15px] leading-relaxed text-slate-600">
                    Thanks {form.name.split(" ")[0]} — we will reply to{" "}
                    <span className="font-semibold text-navy-950">{form.email}</span> within 24 hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", subject: "General enquiry", message: "" });
                  }}
                  className="btn-outline !py-2.5 !text-[14.5px]"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={submit}
                noValidate
                className="mt-8 flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-card sm:p-8"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Your name" error={errors.name}>
                    <input className="field" value={form.name} onChange={set("name")} placeholder="Nimal Perera" />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input
                      className="field"
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="you@example.com"
                    />
                  </Field>
                </div>

                <Field label="Subject">
                  <select className="field" value={form.subject} onChange={set("subject")}>
                    <option>General enquiry</option>
                    <option>Live fish availability</option>
                    <option>Custom aquascape project</option>
                    <option>Order or delivery support</option>
                    <option>Wholesale / partnership</option>
                  </select>
                </Field>

                <Field label="Message" error={errors.message}>
                  <textarea
                    className="field min-h-[150px] resize-y"
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Tell us about your tank, the species you are after, or the support you need…"
                  />
                </Field>

                <button type="submit" className="btn-primary self-start">
                  <Send size={16} /> Send message
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-8">
          <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-navy-950 shadow-card">
            <div className="absolute inset-0 bg-[radial-gradient(500px_260px_at_30%_20%,rgba(30,144,240,0.4),transparent_70%)]" />
            <div className="relative z-10 flex flex-col items-start gap-4 p-8 text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-aqua-400 ring-1 ring-white/15">
                <MapPin size={22} />
              </span>
              <h3 className="text-[20px] font-bold">Visit the flagship store</h3>
              <p className="max-w-xs text-[15px] leading-relaxed text-white/60">
                42 Marine Drive, Colombo 03, Sri Lanka — opposite the arcade, ground floor with the
                blue sign.
              </p>
              <div className="mt-1 flex flex-wrap gap-3">
                <a
                  href="https://maps.google.com/?q=Marine+Drive+Colombo"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-navy-950 transition hover:-translate-y-0.5"
                >
                  Get directions
                </a>
                <Link href="/shop" className="rounded-full border border-white/25 px-5 py-2.5 text-[14px] font-semibold transition hover:bg-white/10">
                  Browse products
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[17px] font-bold text-navy-950">Frequently asked</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {faqs.map((faq, index) => {
                const open = openFaq === index;
                return (
                  <li key={faq.q} className="card-base overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : index)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-[15px] font-semibold text-navy-950">{faq.q}</span>
                      <ChevronDown
                        size={16}
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
                          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-slate-500">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>

          <a
            href="https://wa.me/94774564567"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 rounded-3xl bg-ocean-600 p-6 text-white shadow-glow transition hover:-translate-y-1 hover:bg-ocean-500"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
              <MessageCircle size={20} />
            </span>
            <span>
              <span className="block text-[15.5px] font-bold">Chat with an aquarist</span>
              <span className="block text-[14px] text-white/70">Fastest answers on WhatsApp</span>
            </span>
          </a>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13.5px] font-semibold text-slate-500">{label}</span>
      {children}
      {error && <span className="text-[13px] font-medium text-rose-500">{error}</span>}
    </label>
  );
}
