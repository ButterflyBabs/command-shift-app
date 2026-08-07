import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        indigo: { DEFAULT: "#1F315B", deep: "#16233F" },
        plum: "#5E3B6C",
        teal: "#2E7C83",
        gold: { DEFAULT: "#D4AF63", soft: "#E4C888" },
        lavender: "#C9BEDD",
        ivory: "#FBF7EF",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "Cambria", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(31,49,91,0.35)",
        card: "0 10px 40px -12px rgba(31,49,91,0.22)",
      },
      keyframes: {
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        fadeUp: { "0%": { opacity: "0", transform: "translateY(14px)" }, "100%": { opacity: "1", transform: "none" } },
      },
      animation: { floaty: "floaty 6s ease-in-out infinite", fadeUp: "fadeUp 0.7s ease-out both" },
    },
  },
  plugins: [],
};

export default config;
