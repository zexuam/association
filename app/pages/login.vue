<template>
  <v-form
    @submit.prevent="submitData"
    class="bg-surface rounded px-2 pb-3"
    ref="form"
    style="margin: 0 auto; width: 70%"
  >
    <h1 class="text-center">Login to your account</h1>
    <v-text-field
      type="email"
      label="Email"
      density="compact"
      v-model="email"
      :rules="[rules.email]"
      validate-on="submit"
      variant="outlined"
    />
    <v-text-field
      :type="visible ? 'text' : 'password'"
      label="Password"
      density="compact"
      variant="outlined"
      validate-on="submit"
      v-model="password"
      :rules="[rules.password]"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="visible = !visible"
    />
    <v-checkbox v-model="remember" density="compact" label="Remember me" />
    <NuxtLink>Forgot password?</NuxtLink>
    <v-btn
      type="submit"
      width="100%"
      color="primary"
      class="mb-4"
      :loading="isLoading"
      style="font-size: 1.2rem; font-weight: 600"
    >
      Login
    </v-btn>
    <v-alert
      type="error"
      v-if="auth.loginErrMsg.err"
      :title="auth.loginErrMsg?.title"
      closable
    />
    <p>
      Don't have account?
      <NuxtLink to="/">Sign up</NuxtLink>
    </p>

    <v-divider class="my-4">OR</v-divider>

    <v-btn
      width="100%"
      color="primary"
      class="mt-4"
      style="font-size: 1.2rem; font-weight: 600"
      >Login with google</v-btn
    >
  </v-form>
</template>

<script setup>
const visible = ref(false);
const remember = ref(true);
const isLoading = ref(false);

const rules = {
  email: (v) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) ||
    "Email is Invalid",
  password: (v) => !!v || "Password is required",
};
const form = useTemplateRef("form");

const email = ref("");
const password = ref("");

const auth = useAuthStore();

async function submitData(e) {
  const { valid } = await form.value.validate();

  if (!valid) return;

  isLoading.value = true;

  await auth.login(email.value, password.value);
  isLoading.value = false;
}
</script>

<style scoped></style>
