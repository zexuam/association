export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  runtimeConfig: {
    association: process.env.ASSOCIATION_API,
    accessToken: process.env.JWT_ACCESS_TOKEN,
    refreshToken: process.env.JWT_REFRESH_TOKEN,
  },
  routeRules: {
    "/tnc.pdf": {
      headers: { "cache-control": "no-cache" },
    },
  },
  modules: [
    "@vite-pwa/nuxt",
    "vuetify-nuxt-module",
    "@pinia/nuxt",
    "@vueuse/nuxt",
  ],
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: "dark",
      },
      display: {
        mobileBreakpoint: "sm",
      },
    },
    moduleOptions: {
      ssrClientHints: {
        viewportSize: true,
        reloadOnFirstRequest: true,
      },
    },
  },
  app: {
    head: {
      link: [{ rel: "manifest", href: "/manifest.webmanifest" }],
    },
  },
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Ekota Association",
      short_name: "Ekota Association",
      description: "Track your diposits",
      theme_color: "#121212",
      background_color: "#121212",
      icons: [
        { src: "icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "icon-512.png", sizes: "512x512", type: "image/png" },
        {
          src: "icon-512-maskable.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: /^\/api\/.*/i,
          handler: "NetworkFirst",
          options: {
            cacheName: "api-cache",
            expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
            cacheableResponse: { statuses: [0, 200] },
            networkTimeoutSeconds: 5,
          },
        },
        {
          urlPattern: /\/tnc\.pdf$/i,
          handler: "NetworkFirst",
          options: {
            cacheName: "pdf-cache-v2",
            networkTimeoutSeconds: 5,
            expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 },
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
          handler: "CacheFirst",
          options: {
            cacheName: "image-cache",
            expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
          },
        },
        {
          urlPattern: /\.(?:woff|woff2|ttf|otf)$/i,
          handler: "CacheFirst",
          options: {
            cacheName: "font-cache",
            expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },
});
