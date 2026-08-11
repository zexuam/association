<template>
  <div
    class="bg-black mx-auto rounded my-2 text-center pa-2"
    style="width: 100%; max-width: 450px"
  >
    <h1 class="my-0">Hello</h1>
    <p class="mt-0">Welcome to {{ app.seo.appName }}</p>
    <v-form @submit.prevent="createAccount" class="text-left" ref="form">
      <v-text-field
        type="text"
        v-model="user.firstName"
        density="compact"
        variant="outlined"
        label="Enter Your First Name"
        :rules="[rules.firstName]"
      />
      <v-text-field
        type="text"
        v-model="user.lastName"
        density="compact"
        variant="outlined"
        label="Enter Your Last Name"
        :rules="[rules.lastName]"
      />
      <v-text-field
        type="text"
        v-model="user.email"
        density="compact"
        variant="outlined"
        label="Enter Your Email"
        :rules="[rules.email, rules.emailValid]"
      />
      <v-text-field
        :type="visible ? 'text' : 'password'"
        v-model="user.password"
        density="compact"
        variant="outlined"
        label="Enter Your Password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="visible = !visible"
        :rules="passwordRules"
      />
      <v-checkbox v-model="user.agree" density="compact" :rules="[rules.agree]">
        <template #label>
          <span
            >Agree to
            <NuxtLink>Terms & Conditions</NuxtLink>
          </span>
        </template>
      </v-checkbox>
      <div class="text-center">
        <v-btn
          type="submit"
          width="70%"
          class="my-2 mb-4 bg-primary"
          style="font-size: 1.2rem; font-weight: 700"
        >
          Create Account
        </v-btn>
        <v-alert
          type="error"
          v-if="auth.errMsg.err"
          :title="auth.errMsg.title"
          :text="auth.errMsg.message"
          class="text-left"
          variant="tonal"
          closable
        />
        <p class="text-left">
          Already have an account?
          <NuxtLink to="/login">Login</NuxtLink>
        </p>
      </div>
    </v-form>

    <template v-if="false">
      <v-divider>OR Login With Social</v-divider>
      <v-btn-group class="mt-4">
        <v-btn icon>
          <v-icon>mdi-google</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-facebook</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-twitter</v-icon>
        </v-btn>
      </v-btn-group>
    </template>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

const visible = ref(false);

const app = useAppConfig();
const user = reactive({});
const rules = {
  firstName: (v) => !!v || "First Name is required",
  lastName: (v) => !!v || "Last Name is required",
  email: (v) => !!v || "Email is required",
  emailValid: (v) =>
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
    "Please fill a valid email address",
  agree: (v) => !!v || "You must agree to terms & conditions",
};

const passwordRules = [
  (v) => !!v || "Password is required",
  (v) => (v && v.length >= 8) || "Password must be at least 8 characters",
  (v) => /[A-Z]/.test(v) || "Must contain at least one uppercase letter",
  (v) => /[0-9]/.test(v) || "Must contain at least one number",
  (v) =>
    /[^A-Za-z0-9]/.test(v) || "Must contain at least one special character",
];

const form = useTemplateRef("form");
const auth = useAuthStore();

async function createAccount() {
  const { valid } = await form.value.validate();

  if (!valid) return;

  await auth.signup(user);
}
</script>

<style scoped></style>
