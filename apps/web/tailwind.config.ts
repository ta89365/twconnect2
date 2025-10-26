import type { Config } from "tailwindcss";

export default {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brandBlue: "#1C3D5A"
      }
    }
  },
  plugins: []
} satisfies Config;
