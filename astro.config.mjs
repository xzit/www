// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import keystatic from "@keystatic/astro";

// https://astro.build/config
export default defineConfig({
  site: "https://xzit.dev/",
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["gsap", "gsap/ScrambleTextPlugin"],
    },
    ssr: {
      noExternal: ["gsap", "gsap/ScrambleTextPlugin"],
    },
  },
  integrations: [react(), markdoc(), keystatic()],
  experimental: {
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: "Geist Mono",
        cssVariable: "--font-geist-mono",
        fallbacks: ["monospace"],
        weights: ["400 700"],
      },
      {
        provider: fontProviders.fontsource(),
        name: "VT323",
        cssVariable: "--font-vt323",
        fallbacks: ["monospace"],
        weights: ["400 700"],
      },
      {
        provider: fontProviders.fontsource(),
        name: "Xanh Mono",
        cssVariable: "--font-xanh-mono",
        fallbacks: ["serif"],
        weights: ["400"],
        styles: ["normal", "italic"],
      },
    ],
  },
});
