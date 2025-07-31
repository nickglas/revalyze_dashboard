import { heroui } from "@heroui/theme";
import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...fontFamily.sans],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      prefix: "heroui",
      defaultTheme: "dark",
      defaultExtendTheme: "dark",
      theme: {
        extend: {
          fontFamily: {
            sans: ["Poppins", ...fontFamily.sans],
          },
        },
      },
    }),
  ],
};
