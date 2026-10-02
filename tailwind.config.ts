import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#F0F8FF",
          100: "#E0F1FF",
          200: "#BBE1FF",
          300: "#88CBFF",
          400: "#4FAEFF",
          500: "#1E90F0",
          600: "#0B76D1",
          700: "#0A5DAA",
          800: "#0C4E8C",
          900: "#0E4173",
        },
        navy: {
          700: "#0A3557",
          800: "#072A46",
          900: "#042035",
          950: "#02141F",
        },
        aqua: {
          300: "#7DF3F5",
          400: "#3FE3E8",
          500: "#16C7CF",
          600: "#0BA4AD",
        },
        mist: "#F2F8FE",
        ink: "#08192B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(8, 25, 43, 0.04), 0 8px 24px -12px rgba(8, 25, 43, 0.12)",
        lift: "0 18px 44px -22px rgba(8, 44, 80, 0.45)",
        glow: "0 12px 34px -12px rgba(30, 144, 240, 0.55)",
        aquaGlow: "0 14px 40px -14px rgba(22, 199, 207, 0.55)",
        deep: "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        rise: {
          "0%": { transform: "translateY(0) scale(0.85)", opacity: "0" },
          "20%": { opacity: "0.7" },
          "100%": { transform: "translateY(-160px) scale(1.15)", opacity: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(-12px, 10px, 0)" },
        },
        ray: {
          "0%,100%": { opacity: "0.18", transform: "translateX(-6%) skewX(-8deg)" },
          "50%": { opacity: "0.42", transform: "translateX(6%) skewX(-8deg)" },
        },
        waveMove: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.9" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { opacity: "0" },
        },
        kenburns: {
          "0%": { transform: "scale(1.06)" },
          "100%": { transform: "scale(1.16)" },
        },
        kenburnsAlt: {
          "0%": { transform: "scale(1.16) translateX(-2%)" },
          "100%": { transform: "scale(1.06) translateX(1%)" },
        },
        bubble: {
          "0%": { transform: "translate3d(0, 0, 0) scale(0.7)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": {
            transform: "translate3d(var(--drift, 24px), -115vh, 0) scale(1.15)",
            opacity: "0",
          },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
        drift: "drift 12s ease-in-out infinite",
        ray: "ray 9s ease-in-out infinite",
        waveMove: "waveMove 26s linear infinite",
        pulseRing: "pulseRing 700ms ease-out",
        kenburns: "kenburns 22s ease-in-out alternate infinite",
        kenburnsAlt: "kenburnsAlt 22s ease-in-out alternate infinite",
        bubble: "bubble linear infinite",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
