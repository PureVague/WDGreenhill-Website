import type { Config } from "tailwindcss";

// Tailwind v4 — most configuration lives in globals.css via @theme.
// This file is kept minimal for plugin registration only.
const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  plugins: [],
};

export default config;
