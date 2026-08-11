// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  runtimeConfig: {
    association: process.env.ASSOCIATION_API,
    accessToken: process.env.JWT_ACCESS_TOKEN,
    refreshToken: process.env.JWT_REFRESH_TOKEN,
  },
  modules: ['vuetify-nuxt-module', '@pinia/nuxt'],
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: "dark"
      }
    }
  }
})