// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import keystatic from "@keystatic/astro";

import markdoc from "@astrojs/markdoc";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

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

  i18n: {
    locales: ["es"],
    defaultLocale: "es",
  },

  integrations: [
    react(),
    markdoc(),
    keystatic(),
    sitemap({
      filter: (page) =>
        page !== "https://xzit.dev/keystatic" &&
        page !== "https://xzit.dev/privacy",
      i18n: {
        defaultLocale: "es",
        locales: { es: "es-ES" },
      },
    }),
  ],

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

  adapter: vercel(),
});
