export default defineNuxtPlugin(async (to) => {
  const auth = useAuthStore();

  try {
    if (!["/signup", "/login"].includes(to._route.path)) {
      await auth.refresh();
    }
  } catch (err) {}
});
