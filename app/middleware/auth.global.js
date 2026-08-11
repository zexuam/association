export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  if (auth.isLoggedIn && (to.path === "/signup" || to.path === "/login")) {
    return navigateTo("/association");
  } else if (!auth.isLoggedIn && to.path === "/settings") {
    return navigateTo("/login");
  }
});
