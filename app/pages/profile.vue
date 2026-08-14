<template>
  <div v-if="!data">
    <v-skeleton-loader type="article, article, article" />
  </div>
  <div v-else style="max-width: 500px" class="bg-black pa-2 rounded mx-auto">
    <v-list class="text-center">
      <h2>Profile</h2>
      <v-list-item class="text-center">
        <div class="text-left">
          <h3 class="my-1">Name:</h3>
          <v-text-field
            :value="`${data?.firstName} ${data?.lastName}`"
            readonly
            density="compact"
            variant="outlined"
          />
        </div>

        <div class="text-left">
          <h3 class="my-1">Email:</h3>
          <v-text-field
            :value="data?.email"
            readonly
            density="compact"
            variant="outlined"
          />
        </div>

        <v-form
          @submit.prevent="updatePassword"
          ref="passwordForm"
          class="text-left border pa-2 rounded"
        >
          <div class="text-center">
            <v-icon icon="mdi-tools" size="large" color="amber"></v-icon>
            <div class="text-subtitle-1 font-weight-bold mt-1 text-amber">
              Feature Under Construction
            </div>
          </div>
          <h3 class="my-1">Update Password:</h3>
          <v-text-field
            label="Old Password"
            v-model="passwords.old"
            density="compact"
            disabled
            :rules="[(v) => !!v || 'Old Password is required']"
            variant="outlined"
          />
          <v-text-field
            v-model="passwords.new"
            label="New Password"
            :rules="passwordRules"
            disabled
            density="compact"
            variant="outlined"
          />
          <v-btn color="primary" type="submit" disabled>Update</v-btn>
        </v-form>

        <div class="text-left rounded mt-5" style="border: 2px solid red">
          <h2 class="bg-red mt-0 pa-2">Danger Zone</h2>
          <div class="pa-2">
            <h3 class="my-3" style="color: red">Deactive Account:</h3>
            <v-btn color="red w-100">Deactive</v-btn>
            <h3 class="my-3" style="color: red">Delete Account:</h3>
            <v-btn color="red w-100">Delete</v-btn>
          </div>
        </div>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
const data = ref(null);
onMounted(async () => {
  try {
    const res = await $fetch("/api/seeProfile", {
      method: "GET",
    });
    data.value = res.user;
  } catch (err) {
    console.log(err);
  }
});

const passwords = ref({});

const passwordRules = [
  (v) => !!v || "New Password is required",
  (v) => (v && v.length >= 8) || "Password must be at least 8 characters",
  (v) => /[A-Z]/.test(v) || "Must contain at least one uppercase letter",
  (v) => /[0-9]/.test(v) || "Must contain at least one number",
  (v) =>
    /[^A-Za-z0-9]/.test(v) || "Must contain at least one special character",
];

const form = useTemplateRef("passwordForm");

async function updatePassword() {
  const { valid } = await form.value.validate();
  if (!valid) return;
}
</script>

<style scoped></style>
