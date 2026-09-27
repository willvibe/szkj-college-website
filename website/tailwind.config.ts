import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        paper: "#f8fafc",
        brand: {
          navy: "#0A1120",
          slate: "#0F172A",
          primary: "#2563EB",
          cyan: "#06B6D4",
          lime: "#10B981",
          amber: "#F59E0B",
          DEFAULT: "#2563eb",
          indigo: "#6366f1",
        },
        accent: "#10b981",
      },
      fontFamily: {
        sans: [
          '"PingFang SC"',
          '"Microsoft YaHei"',
          '"Noto Sans SC"',
          '"Inter"',
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: ['"JetBrains Mono"', "Menlo", "Consolas", "monospace"],
      },
      maxWidth: {
        shell: "1280px",
      },
    },
  },
  plugins: [],
};
export default config;
