import { cn } from "@/lib/utils";

interface Props {
  variant?: "a" | "b" | "c";
  className?: string;
  fill?: string;
  flip?: boolean;
}

const paths = {
  a: "M0,128 C240,192 480,64 720,96 C960,128 1200,224 1440,160 L1440,320 L0,320 Z",
  b: "M0,192 C180,96 420,240 720,192 C1020,144 1260,32 1440,96 L1440,320 L0,320 Z",
  c: "M0,96 C320,16 560,224 880,176 C1120,140 1300,48 1440,80 L1440,320 L0,320 Z",
};

export function WaveDivider({ variant = "a", className, fill = "#ffffff", flip }: Props) {
  return (
    <div
      className={cn("pointer-events-none relative z-10 h-16 w-full overflow-hidden sm:h-24", className)}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className={cn("absolute inset-0 h-full w-full", flip && "rotate-180")}
      >
        <path d={paths[variant]} fill={fill} />
      </svg>
    </div>
  );
}
