<template>
  <v-app-bar location="bottom" :floating="true">
    <v-tabs grow>
      <v-tab to="/" icon stacked>
        <v-icon size="x-large">mdi-home</v-icon>
        <span>Home</span>
      </v-tab>
      <v-tab v-if="isAdmin" icon stacked to="/addDeposit">
        <v-icon size="x-large">mdi-currency-bdt</v-icon>
        <span>Deposit</span>
      </v-tab>
      <v-tab stacked icon to="/profile">
        <v-icon size="x-large">mdi-account</v-icon>
        <span>Profile</span>
      </v-tab>
      <v-tab stacked icon to="/settings">
        <v-icon size="x-large">mdi-cog</v-icon>
        <span>Settings</span>
      </v-tab>
    </v-tabs>
  </v-app-bar>
</template>

<script setup>
const auth = useAuthStore();

const isAdmin = ref(false);
isAdmin.value = await auth.isAdmin();
</script>

<style scoped></style>
