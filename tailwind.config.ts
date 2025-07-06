import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "color-primary": "#3A5BC7",
        "color-primary-hover": "#2F4AB1",
        "color-secondary": "#F1F4FB",
        "color-danger": "#EE6060",
        "color-text-black": "#333333",
        "color-text-white": "#F1F4FB",
        "color-text-gray-dark": "#696969",
        "color-text-gray": "#646464",
        "color-text-gray-light": "#969AA4",
        "color-accent": "#C7A63A",
        "color-tag": "#8B96ED",
        "color-tag-hover": "#6B7CD5",
        "color-category": "#6099F5",
        "color-category-hover": "#4A83DB",
      },
    },
  },
  plugins: [],
};
export default config;
