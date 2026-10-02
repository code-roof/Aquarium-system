"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  CheckCircle2,
  CreditCard,
  Landmark,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { useToast } from "@/providers/ToastProvider";
import { demoAddresses } from "@/data/orders";
import { cn, formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";

type Step = 0 | 1 | 2 | 3;

const steps = ["Delivery", "Payment", "Review"];

const deliveryOptions = [
  {
    id: "standard",
    title: "Standard delivery",
    detail: "2 – 4 working days, island-wide",
    icon: Truck,
  },
  {
    id: "express",
    title: "Express delivery",
    detail: "Next working day within Western Province",
    icon: Package,
  },
  {
    id: "pickup",
    title: "Store pickup",
    detail: "42 Marine Drive, Colombo 03",
    icon: Store,
  },
] as const;

const paymentOptions = [
  { id: "card", title: "Credit / Debit card", detail: "Visa, Mastercard (demo)", icon: CreditCard },
  { id: "transfer", title: "Bank transfer", detail: "Commercial Bank (demo)", icon: Landmark },
  { id: "cod", title: "Cash on delivery", detail: "Pay when your order arrives", icon: Banknote },
] as const;

interface Form {
  name: string;
  email: string;
  phone: string;
  line1: string;
  city: string;
  province: string;
  notes: string;
}

const initialForm: Form = {
  name: "",
  email: "",
  phone: "",
  line1: "",
  city: "",
  province: "Western",
  notes: "",
};

export function CheckoutClient() {
  const { items, subtotal, deliveryFee, discount, coupon, clear } = useCart();
  const { push } = useToast();
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<Form>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [delivery, setDelivery] = useState<(typeof deliveryOptions)[number]["id"]>("standard");
  const [payment, setPayment] = useState<(typeof paymentOptions)[number]["id"]>("card");
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const expressFee = delivery === "express" ? 1500 : 0;
  const shipping = delivery === "pickup" ? 0 : deliveryFee + expressFee;
  const grandTotal = Math.max(0, subtotal + shipping - discount);

  const orderItems = useMemo(() => items, [items]);

  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateDelivery = () => {
    if (delivery === "pickup") return true;
    const next: Partial<Record<keyof Form, string>> = {};
    if (form.name.trim().length < 3) next.name = "Enter the recipient's full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address";
    if (!/^[0-9+\-\s]{9,15}$/.test(form.phone)) next.phone = "Enter a valid phone number";
    if (form.line1.trim().length < 5) next.line1 = "Enter your street address";
    if (form.city.trim().length < 2) next.city = "Enter your city";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const nextStep = () => {
    if (step === 0 && !validateDelivery()) {
      push({ title: "Check your details", description: "Some required fields need attention", variant: "error" });
      return;
    }
    setStep((s) => Math.min(2, s + 1) as Step);
  };

  const placeOrder = () => {
    setPlacing(true);
    window.setTimeout(() => {
      const id = `AQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderId(id);
      setPlacing(false);
      setStep(3);
      clear();
      push({ title: "Order placed", description: `Reference ${id}` });
    }, 1100);
  };

  if (step !== 3 && items.length === 0) {
    return (
      <div className="container-x pb-24 pt-[130px]">
        <h1 className="text-[34px] font-bold tracking-[-0.02em] text-navy-950">Checkout</h1>
        <div className="mt-10">
          <EmptyState
            icon={<ShoppingBag size={30} />}
            title="Nothing to check out."
            description="Your cart is empty — add a few products first."
            actionLabel="Browse the shop"
            actionHref="/shop"
          />
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="container-x flex flex-col items-center pb-24 pt-[140px] text-center">
        <motion.span
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 ring-8 ring-emerald-500/10"
        >
          <CheckCircle2 size={46} />
        </motion.span>
        <h1 className="mt-7 text-[34px] font-bold tracking-[-0.02em] text-navy-950">
          Order confirmed
        </h1>
        <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-slate-500">
          Thank you! Your reference is{" "}
          <span className="font-bold text-navy-950">{orderId}</span>. A confirmation email would be
          sent to <span className="font-semibold text-navy-950">{form.email || "your inbox"}</span>.
        </p>

        <div className="mt-8 grid w-full max-w-2xl gap-4 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, label: "Demo order", detail: "No payment was taken" },
            { icon: Truck, label: "Delivery", detail: delivery === "pickup" ? "Store pickup" : "2 – 4 days" },
            { icon: MapPin, label: "Address", detail: delivery === "pickup" ? "Colombo 03" : form.city || "Colombo" },
          ].map((item) => (
            <div key={item.label} className="card-base flex flex-col items-center gap-2 p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ocean-50 text-ocean-600">
                <item.icon size={18} />
              </span>
              <span className="text-[14.5px] font-semibold text-navy-950">{item.label}</span>
              <span className="text-[13px] text-slate-500">{item.detail}</span>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link href="/account/orders" className="btn-primary">
            View my orders <ArrowRight size={16} />
          </Link>
          <Link href="/shop" className="btn-outline">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x pb-24 pt-[130px]">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-[34px] font-bold tracking-[-0.02em] text-navy-950">Checkout</h1>
          <p className="mt-1.5 text-[15px] text-slate-500">
            {items.length} item{items.length === 1 ? "" : "s"} · {formatPrice(grandTotal)}
          </p>
        </div>

        <ol className="flex items-center gap-2" aria-label="Checkout progress">
          {steps.map((label, index) => {
            const done = index < step;
            const current = index === step;
            return (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold transition",
                    done
                      ? "bg-ocean-600 text-white"
                      : current
                        ? "bg-navy-950 text-white"
                        : "bg-slate-100 text-slate-400"
                  )}
                >
                  {done ? <Check size={15} /> : index + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-[14px] font-semibold sm:block",
                    current ? "text-navy-950" : "text-slate-400"
                  )}
                >
                  {label}
                </span>
                {index < steps.length - 1 && <span className="mx-1 h-px w-6 bg-slate-200 sm:w-10" />}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-9 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="card-base min-h-[420px] p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="delivery"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-[19px] font-bold text-navy-950">Delivery details</h2>
                  <p className="mt-1 text-[14.5px] text-slate-500">
                    Choose a saved address or enter a new one.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {demoAddresses.slice(0, 3).map((address) => (
                    <button
                      key={address.id}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          name: address.recipient,
                          line1: address.line1,
                          city: address.city,
                          province: address.province,
                          phone: address.phone,
                        }))
                      }
                      className={cn(
                        "rounded-2xl border p-4 text-left transition",
                        form.line1 === address.line1
                          ? "border-ocean-400 bg-ocean-50 ring-2 ring-ocean-100"
                          : "border-slate-200 hover:border-ocean-200"
                      )}
                    >
                      <span className="block text-[13px] font-bold uppercase tracking-[0.12em] text-ocean-600">
                        {address.label}
                      </span>
                      <span className="mt-1.5 block text-[14px] font-semibold text-navy-950">
                        {address.recipient}
                      </span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-slate-500">
                        {address.line1}, {address.city}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" error={errors.name}>
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
                  <Field label="Phone" error={errors.phone}>
                    <input
                      className="field"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="+94 77 123 4567"
                    />
                  </Field>
                  <Field label="City" error={errors.city}>
                    <input className="field" value={form.city} onChange={set("city")} placeholder="Colombo 03" />
                  </Field>
                  <Field label="Street address" error={errors.line1} className="sm:col-span-2">
                    <input
                      className="field"
                      value={form.line1}
                      onChange={set("line1")}
                      placeholder="42 Marine Drive"
                    />
                  </Field>
                  <Field label="Order notes (optional)" className="sm:col-span-2">
                    <textarea
                      className="field min-h-[90px] resize-y"
                      value={form.notes}
                      onChange={set("notes")}
                      placeholder="Landmark, gate code, best delivery time…"
                    />
                  </Field>
                </div>

                <div>
                  <h3 className="mb-3 text-[13px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Delivery method
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {deliveryOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setDelivery(option.id)}
                        className={cn(
                          "flex flex-col gap-2 rounded-2xl border p-4 text-left transition",
                          delivery === option.id
                            ? "border-ocean-400 bg-ocean-50 ring-2 ring-ocean-100"
                            : "border-slate-200 hover:border-ocean-200"
                        )}
                      >
                        <option.icon size={18} className="text-ocean-600" />
                        <span className="text-[14.5px] font-semibold text-navy-950">{option.title}</span>
                        <span className="text-[13px] text-slate-500">{option.detail}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-[19px] font-bold text-navy-950">Payment method</h2>
                  <p className="mt-1 text-[14.5px] text-slate-500">
                    Prototype only — no real payment details are processed or stored.
                  </p>
                </div>

                <div className="grid gap-3">
                  {paymentOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setPayment(option.id)}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl border p-4 text-left transition",
                        payment === option.id
                          ? "border-ocean-400 bg-ocean-50 ring-2 ring-ocean-100"
                          : "border-slate-200 hover:border-ocean-200"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl",
                          payment === option.id ? "bg-ocean-600 text-white" : "bg-mist text-slate-500"
                        )}
                      >
                        <option.icon size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold text-navy-950">
                          {option.title}
                        </span>
                        <span className="block text-[13.5px] text-slate-500">{option.detail}</span>
                      </span>
                      <span
                        className={cn(
                          "h-4 w-4 rounded-full border-[4px] transition",
                          payment === option.id ? "border-ocean-600 bg-white" : "border-slate-200"
                        )}
                      />
                    </button>
                  ))}
                </div>

                {payment === "card" && (
                  <div className="grid gap-4 rounded-2xl bg-mist p-5 sm:grid-cols-2">
                    <Field label="Card number" className="sm:col-span-2">
                      <input className="field" placeholder="4242 4242 4242 4242" inputMode="numeric" />
                    </Field>
                    <Field label="Expiry">
                      <input className="field" placeholder="12 / 29" />
                    </Field>
                    <Field label="CVC">
                      <input className="field" placeholder="123" inputMode="numeric" />
                    </Field>
                    <p className="text-[13px] text-slate-400 sm:col-span-2">
                      Demo card fields — do not enter real card numbers.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-[19px] font-bold text-navy-950">Review your order</h2>
                  <p className="mt-1 text-[14.5px] text-slate-500">
                    Everything look right? Place the order to finish.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 p-5">
                  <h3 className="text-[13px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Items
                  </h3>
                  <ul className="mt-4 flex flex-col gap-4">
                    {orderItems.map((item) => (
                      <li key={item.product.slug} className="flex items-center gap-4">
                        <span className="relative h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-mist">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-semibold text-navy-950">
                            {item.product.name}
                          </span>
                          <span className="block text-[13px] text-slate-400">
                            Qty {item.quantity} · {formatPrice(item.product.price)}
                          </span>
                        </span>
                        <span className="text-[15px] font-bold text-navy-950">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 p-5">
                    <h3 className="text-[13px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Delivering to
                    </h3>
                    <p className="mt-2.5 text-[15px] font-semibold text-navy-950">
                      {form.name || "Store pickup"}
                    </p>
                    <p className="mt-1 text-[14px] leading-relaxed text-slate-500">
                      {delivery === "pickup"
                        ? "42 Marine Drive, Colombo 03"
                        : `${form.line1}, ${form.city}`}
                    </p>
                    <p className="mt-1.5 text-[13.5px] text-slate-400">{form.phone || "—"}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-5">
                    <h3 className="text-[13px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Payment
                    </h3>
                    <p className="mt-2.5 text-[15px] font-semibold text-navy-950">
                      {paymentOptions.find((o) => o.id === payment)?.title}
                    </p>
                    <p className="mt-1 text-[14px] text-slate-500">
                      {payment === "cod" ? "Pay on delivery" : "Demo payment — no charge"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1) as Step)}
              disabled={step === 0}
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-slate-500 transition hover:text-navy-950 disabled:opacity-40"
            >
              <ArrowLeft size={16} /> Back
            </button>

            {step < 2 ? (
              <button type="button" onClick={nextStep} className="btn-primary">
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={placeOrder}
                disabled={placing}
                className="btn-primary min-w-[190px]"
              >
                {placing ? "Placing order…" : `Place order · ${formatPrice(grandTotal)}`}
              </button>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="card-base p-6">
            <h2 className="text-[17px] font-bold text-navy-950">Summary</h2>
            <dl className="mt-5 flex flex-col gap-3 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-slate-500">Subtotal</dt>
                <dd className="font-semibold text-navy-950">{formatPrice(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <dt>Discount {coupon && `(${coupon})`}</dt>
                  <dd className="font-semibold">−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-slate-500">
                  Delivery{expressFee > 0 && " (express)"}
                </dt>
                <dd className="font-semibold text-navy-950">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </dd>
              </div>
              <div className="mt-1 flex items-baseline justify-between border-t border-slate-100 pt-4">
                <dt className="text-[16px] font-semibold text-navy-950">Total</dt>
                <dd className="text-[24px] font-bold text-navy-950">{formatPrice(grandTotal)}</dd>
              </div>
            </dl>

            <ul className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 text-[13.5px] text-slate-500">
              <li className="flex items-start gap-2.5">
                <ShieldCheck size={15} className="mt-0.5 shrink-0 text-ocean-600" /> Secure demo
                checkout with no real payment
              </li>
              <li className="flex items-start gap-2.5">
                <Truck size={15} className="mt-0.5 shrink-0 text-ocean-600" /> Free delivery on orders
                over LKR 25,000
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[13.5px] font-semibold text-slate-500">{label}</span>
      {children}
      {error && <span className="text-[13px] font-medium text-rose-500">{error}</span>}
    </label>
  );
}
