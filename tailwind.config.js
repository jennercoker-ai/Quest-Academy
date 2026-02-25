/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ── Brand Palette ─────────────────────────────────
      colors: {
        quest: {
          navy:    "#0c1a3a",
          "navy-dark": "#020617",
          gold:    "#f59e0b",
          "gold-light": "#fbbf24",
          emerald: "#10b981",
          ink:     "#0f172a",
        },
      },
      fontFamily: {
        display: ["'Cinzel'", "serif"],
        body:    ["'Lora'", "serif"],
        sans:    ["'DM Sans'", "sans-serif"],
      },
      animation: {
        "xp-burst":     "xpBurst 1.8s ease-out forwards",
        "shake":        "shake 0.45s ease-out",
        "hint-slide":   "hintSlide 0.35s ease-out",
        "reveal-drop":  "revealDrop 0.4s ease-out",
        "success-pop":  "successPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "trophy-pop":   "trophyPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "card-in":      "cardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        "bounce-slow":  "bounceSlow 1.5s ease-in-out infinite",
      },
      keyframes: {
        xpBurst: {
          "0%":   { opacity: "0", transform: "scale(0.5) translateY(10px)" },
          "30%":  { opacity: "1", transform: "scale(1.15) translateY(-20px)" },
          "70%":  { opacity: "1", transform: "scale(1.0) translateY(-30px)" },
          "100%": { opacity: "0", transform: "scale(0.8) translateY(-60px)" },
        },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "20%":     { transform: "translateX(-6px)" },
          "40%":     { transform: "translateX(6px)" },
          "60%":     { transform: "translateX(-4px)" },
          "80%":     { transform: "translateX(4px)" },
        },
        hintSlide: {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        revealDrop: {
          from: { opacity: "0", transform: "scale(0.96) translateY(8px)" },
          to:   { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        successPop: {
          "0%":   { transform: "scale(0.9)", opacity: "0" },
          "60%":  { transform: "scale(1.03)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        trophyPop: {
          "0%":   { transform: "scale(0) rotate(-15deg)" },
          "50%":  { transform: "scale(1.3) rotate(5deg)" },
          "100%": { transform: "scale(1) rotate(0)" },
        },
        cardIn: {
          from: { opacity: "0", transform: "translateY(20px) scale(0.98)" },
          to:   { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        bounceSlow: {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-5px)" },
        },
      },
    },
  },
  plugins: [],
};
