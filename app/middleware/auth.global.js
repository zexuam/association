export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  if (auth.isLoggedIn && (to.path === "/signup" || to.path === "/login")) {
    return navigateTo("/");
  } else if (!auth.isLoggedIn && to.path === "/settings") {
    return navigateTo("/login");
  }
});
