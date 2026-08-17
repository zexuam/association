<template>
  <div style="max-width: 500px" class="bg-black pa-2 rounded mx-auto">
    <v-list>
      <v-list-item to="/tnc">
        <h2 class="ma-0">
          Look our
          <span style="text-decoration: underline; color: yellow">
            Terms And Conditions
          </span>
        </h2>
        <template #append>
          <v-icon size="x-large">mdi-chevron-right</v-icon>
        </template>
      </v-list-item>
      <v-divider :thickness="2" class="my-3" />
      <v-list-item>
        <h2 class="my-0">Logout from the Profile</h2>
        <template #append>
          <v-btn @click="auth.logout()" color="red my-0">Logout</v-btn>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
const auth = useAuthStore();
</script>

<style scoped></style>
