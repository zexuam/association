import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", function () {
  const isAdmin = ref(false);
  const accessToken = ref(null);
  const user = ref(null);
  const errMsg = reactive({
    err: false,
  });
  const loginErrMsg = reactive({
    err: false,
  });
  const fullName = computed(() => user?.firstName + " " + user?.lastName);
  const isLoggedIn = computed(() => !!accessToken.value);

  const requestFetch = useRequestFetch();

  async function login(email, password) {
    try {
      const res = await $fetch("/api/login", {
        method: "POST",
        body: {
          email,
          password,
        },
      });
      accessToken.value = res.accessToken;
      user.value = res.user;
      await navigateTo("/");
    } catch (err) {
      loginErrMsg.err = true;
      loginErrMsg.title = err.data?.message;
    }
  }

  async function signup(body) {
    try {
      const res = await $fetch("/api/signup", {
        method: "POST",
        body,
      });
      accessToken.value = res.accessToken;
      user.value = res.user;
      await navigateTo("/");
    } catch (err) {
      errMsg.err = true;
      errMsg.title = "Account Creation Failed.";
      errMsg.message = err.data.message;
    }
  }

  async function refresh() {
    try {
      const res = await requestFetch("/api/refresh", { method: "POST" });
      accessToken.value = res.accessToken;
      user.value = res.user;
    } catch (err) {
      errMsg.err = true;
      errMsg.message = err.data?.message;
    }
  }

  async function logout() {
    const sure = confirm("Are you sure want to logout?");
    if (sure) {
      try {
        const res = $fetch("/api/logout", { method: "POST" });
        accessToken.value = null;
        user.value = null;
        await navigateTo("/");
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function ifAdmin() {
    try {
      const headers = import.meta.server
        ? useRequestHeaders(["cookie"])
        : undefined;
      const res = await $fetch("/api/ifAdmin", {
        method: "GET",
        headers,
      });
      // console.log(res.data.value);
      isAdmin.value = true;
      return true;
    } catch (err) {
      console.log(isAdmin);
      isAdmin.value = false;
      return false;
    }
  }

  return {
    isAdmin,
    accessToken,
    user,
    fullName,
    errMsg,
    loginErrMsg,
    isLoggedIn,
    login,
    signup,
    refresh,
    logout,
    ifAdmin,
  };
});
