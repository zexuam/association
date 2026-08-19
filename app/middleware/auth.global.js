export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();
  await auth.ifAdmin();

  if (auth.isLoggedIn && ["/signup", "/login"].includes(to.path)) {
    return navigateTo("/");
  } else if (!auth.isLoggedIn && ["/settings", "/profile"].includes(to.path)) {
    return navigateTo("/login");
  }
});
