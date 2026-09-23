import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1220",
        brand: {
          DEFAULT: "#155EEF",
          600: "#2563EB",
          50: "#EEF4FF",
        },
        surface: "#F8FAFC",
      },
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans SC"', "system-ui", "sans-serif"],
      },
      maxWidth: { container: "1200px" },
    },
  },
  plugins: [],
};
export default config;
