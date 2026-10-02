import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  descriptionClassName?: string;
  light?: boolean;
  action?: React.ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  descriptionClassName,
  light,
  action,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "mx-auto max-w-2xl flex-col items-center text-center sm:items-center",
        className
      )}
    >
      <div className={cn("flex flex-col gap-3", align === "center" && "items-center")}>
        {eyebrow && (
          <span className={cn("eyebrow", light && "text-aqua-400")}>{eyebrow}</span>
        )}
        <h2
          className={cn(
            "text-balance text-[30px] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[36px] lg:text-[42px]",
            light ? "text-white" : "text-navy-950"
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "max-w-xl text-[16px] leading-relaxed",
              light ? "text-white/70" : "text-slate-500",
              descriptionClassName
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
