/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        ink: {
          50: "#f0f0f5",
          100: "#dddde8",
          200: "#bcbcd1",
          300: "#9595b5",
          400: "#6e6e95",
          500: "#4a4a75",
          600: "#36365a",
          700: "#252542",
          800: "#17172d",
          900: "#0d0d1a",
          950: "#07070f",
        },
        aurora: {
          cyan: "#00e5ff",
          violet: "#7c3aed",
          rose: "#f43f5e",
          amber: "#f59e0b",
          mint: "#10b981",
          blue: "#3b82f6",
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite",
        "float": "float 3s ease-in-out infinite",
        "wave": "wave 1.5s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "glow": "glow 2s ease-in-out infinite",
        "typing": "typing 1.2s steps(3) infinite",
        "shimmer": "shimmer 2s infinite linear",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(0, 229, 255, 0.4)" },
          "70%": { transform: "scale(1)", boxShadow: "0 0 0 20px rgba(0, 229, 255, 0)" },
          "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(0, 229, 255, 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        wave: {
          "0%, 100%": { transform: "scaleY(0.5)" },
          "50%": { transform: "scaleY(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,229,255,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0,229,255,0.6), 0 0 80px rgba(124,58,237,0.3)" },
        },
        typing: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "aurora-mesh": "radial-gradient(ellipse at 20% 50%, rgba(0,229,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(244,63,94,0.05) 0%, transparent 50%)",
        "card-glass": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        "shimmer-gradient": "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
      },
    },
  },
  plugins: [],
};