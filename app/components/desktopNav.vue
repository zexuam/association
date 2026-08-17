<template>
  <div>
    <v-navigation-drawer v-model="drawer" width="200" class="pa-2" temporary>
      <v-tabs direction="vertical" v-if="auth.isLoggedIn">
        <v-tab to="/settings" class="link">Setting</v-tab>
        <v-tab to="/profile">Profile</v-tab>
        <v-tab v-if="isAdmin" to="/addDeposit">Add Deposit</v-tab>
      </v-tabs>

      <template #append>
        <v-list v-if="auth.isLoggedIn" prepend-gap="8px">
          <v-list-item
            class="text-wrap"
            prepend-icon="mdi-account"
            :title="auth.user?.firstName"
            :subtitle="auth.user?.email"
          />
        </v-list>
        <v-list v-else>
          <v-list-item>
            <v-btn width="100%" color="primary" to="/login">Login</v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn width="100%" color="primary" to="/signup">Signup</v-btn>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-app-bar density="compact" scroll-behavior="hide">
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-spacer />
      <v-text-field
        variant="outlined"
        density="compact"
        type="search"
        hide-details
        label="Search Partner..."
        prepend-inner-icon="mdi-magnify"
        color="background"
      />
      <v-spacer />
      <v-btn icon>
        <v-badge :content="totalNotification" color="yellow">
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>

      <template #extension>
        <v-tabs align-tabs="center" grow>
          <v-tab to="/">Home</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
  </div>
</template>

<script setup>
const drawer = ref(false);
const auth = useAuthStore();

const totalNotification = ref(0);

const isAdmin = ref(false);
isAdmin.value = await auth.isAdmin();
</script>

<style scoped></style>
