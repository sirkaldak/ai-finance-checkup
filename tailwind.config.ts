import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        mint: "#5EEAD4",
        coral: "#FB7185",
        sun: "#FBBF24",
        skysoft: "#BAE6FD"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 32, 51, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
