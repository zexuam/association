export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  console.log();
  if (auth.isLoggedIn && ["/signup", "/login"].includes(to.path)) {
    return navigateTo("/");
  } else if (!auth.isLoggedIn && ["/settings", "/profile"].includes(to.path)) {
    return navigateTo("/login");
  }
});
