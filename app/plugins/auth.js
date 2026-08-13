export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore();
  const route = useRoute();
  try {
    if (!["/signup", "/login"].includes(route.path)) {
      await auth.refresh();
    }
  } catch (err) {}
});
