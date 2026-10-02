import { Headphones, Lock, ShieldCheck, Truck } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const items = [
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    text: "Healthy Fish & Products",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    text: "Island Wide",
  },
  {
    icon: Lock,
    title: "Secure Payment",
    text: "100% Safe Transactions",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    text: "We're Here to Help",
  },
];

export function TrustBar() {
  return (
    <section className="relative z-20 -mt-14 sm:-mt-16">
      <div className="container-x">
        <StaggerContainer className="grid grid-cols-2 gap-y-2 rounded-[28px] bg-white px-4 py-5 shadow-lift sm:grid-cols-2 sm:gap-y-0 lg:grid-cols-4">
          {items.map((item, i) => (
            <StaggerItem key={item.title}>
              <div
                className={cn(
                  "flex h-full items-center gap-3 rounded-2xl px-3 py-4 sm:gap-4 sm:px-5",
                  i % 2 === 1 && "border-l border-slate-100",
                  i >= 2 && "border-t border-slate-100 sm:border-t-0",
                  (i === 1 || i === 3) && "sm:border-l sm:border-slate-100",
                  i === 2 && "lg:border-l lg:border-slate-100",
                  i >= 2 && "sm:border-t sm:border-slate-100 lg:border-t-0"
                )}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ocean-50 text-ocean-500 sm:h-12 sm:w-12">
                  <item.icon size={21} className="sm:h-[22px] sm:w-[22px]" />
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-bold leading-tight text-navy-950 sm:text-[15px]">
                    {item.title}
                  </p>
                  <p className="text-[12.5px] leading-tight text-slate-500 sm:text-[13px]">
                    {item.text}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
