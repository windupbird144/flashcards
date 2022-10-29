import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    VitePWA({
      /**
       * Cache the file extensions below for offline
       * source: https://vite-pwa-org.netlify.app/guide/service-worker-precache.html
       */
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      /**
       * Configure the manifest of the app
       */
      manifest: {
        name: "Flashcards",
        short_name: "Flashcards",
        description: "Offline flash cards app for the browser",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      // Enable the service worker in development
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
