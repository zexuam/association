<template>
  <div style="max-width: 500px" class="bg-black pa-2 rounded mx-auto">
    <v-list>
      <v-list-item class="text-right">
        <v-btn @click="auth.logout()">Logout</v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
const auth = useAuthStore();
</script>

<style scoped></style>
