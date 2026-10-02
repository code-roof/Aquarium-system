"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { demoAddresses } from "@/data/orders";
import type { Address } from "@/types";
import { useToast } from "@/providers/ToastProvider";
import { cn } from "@/lib/utils";

const blank: Address = {
  id: "",
  label: "Home",
  recipient: "",
  line1: "",
  city: "",
  province: "Western",
  phone: "",
};

export default function AddressesPage() {
  const { push } = useToast();
  const [addresses, setAddresses] = useState<Address[]>(demoAddresses);
  const [form, setForm] = useState<Address>(blank);
  const [adding, setAdding] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.recipient.trim().length < 3 || form.line1.trim().length < 5 || form.city.trim().length < 2) {
      push({ title: "Missing details", description: "Name, street and city are required", variant: "error" });
      return;
    }
    setAddresses((prev) => [...prev, { ...form, id: `addr-${Date.now()}` }]);
    setForm(blank);
    setAdding(false);
    push({ title: "Address saved", description: form.line1 });
  };

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    push({ title: "Default address updated", variant: "info" });
  };

  const remove = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    push({ title: "Address removed", variant: "info" });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Delivery book</p>
          <h1 className="mt-2 text-[30px] font-bold tracking-[-0.02em] text-navy-950">Addresses</h1>
          <p className="mt-2 text-[15.5px] text-slate-500">
            Saved delivery points for faster checkout.
          </p>
        </div>
        <button type="button" onClick={() => setAdding((v) => !v)} className="btn-primary !py-2.5 !text-[14.5px]">
          <Plus size={16} /> {adding ? "Cancel" : "Add address"}
        </button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={save}
            className="card-base overflow-hidden"
          >
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-[13.5px] font-semibold text-slate-500">Label</span>
                <select
                  className="field"
                  value={form.label}
                  onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                >
                  <option>Home</option>
                  <option>Office</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[13.5px] font-semibold text-slate-500">Recipient</span>
                <input
                  className="field"
                  value={form.recipient}
                  onChange={(e) => setForm((p) => ({ ...p, recipient: e.target.value }))}
                  placeholder="Full name"
                />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-[13.5px] font-semibold text-slate-500">Street address</span>
                <input
                  className="field"
                  value={form.line1}
                  onChange={(e) => setForm((p) => ({ ...p, line1: e.target.value }))}
                  placeholder="No. 142/3, Park Road"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[13.5px] font-semibold text-slate-500">City</span>
                <input
                  className="field"
                  value={form.city}
                  onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                  placeholder="Nugegoda"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[13.5px] font-semibold text-slate-500">Phone</span>
                <input
                  className="field"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+94 77 123 4567"
                />
              </label>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-primary">
                  Save address
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={cn(
              "card-base flex flex-col gap-4 p-6",
              address.isDefault && "ring-2 ring-ocean-200"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600">
                  <MapPin size={18} />
                </span>
                <span>
                  <span className="block text-[15.5px] font-bold text-navy-950">{address.label}</span>
                  {address.isDefault && (
                    <span className="block text-[12.5px] font-semibold text-ocean-600">
                      Default address
                    </span>
                  )}
                </span>
              </span>
              <span className="flex gap-1.5">
                <button
                  type="button"
                  aria-label={`Edit ${address.label} address`}
                  onClick={() => push({ title: "Editing is demo-only", variant: "info" })}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-ocean-50 hover:text-ocean-600"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${address.label} address`}
                  onClick={() => remove(address.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                >
                  <Trash2 size={15} />
                </button>
              </span>
            </div>

            <div className="text-[14.5px] leading-relaxed text-slate-500">
              <p className="font-medium text-navy-950">{address.recipient}</p>
              <p>{address.line1}</p>
              <p>
                {address.city}, {address.province} Province
              </p>
              <p className="mt-1 text-slate-400">{address.phone}</p>
            </div>

            {!address.isDefault && (
              <button
                type="button"
                onClick={() => setDefault(address.id)}
                className="mt-auto inline-flex items-center gap-1.5 self-start rounded-full border border-slate-200 px-4 py-2 text-[13.5px] font-semibold text-slate-600 transition hover:border-ocean-300 hover:text-ocean-700"
              >
                <Star size={14} /> Set as default
              </button>
            )}
            {address.isDefault && (
              <span className="mt-auto inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-emerald-600">
                <Check size={14} /> Ready for checkout
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
