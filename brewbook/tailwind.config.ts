import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;

