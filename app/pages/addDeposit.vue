<template>
  <div
    class="bg-black rounded mx-auto pa-2 d-flex flex-column ga-3"
    style="max-width: 600px; width: 100%"
  >
    <NewDiposit @updated="updated" />
  </div>

  <v-snackbar
    v-model="msg"
    :color="addedDeposit ? 'success' : 'error'"
    :title="
      addedDeposit ? 'Successfully added' : 'Error found. Please try again.'
    "
    :timeout="10000"
  >
    <template #actions>
      <v-icon @click="msg = false"> mdi-close-circle </v-icon>
    </template>
  </v-snackbar>
</template>

<script setup>
const msg = ref(false);
const addedDeposit = ref(true);
function updated(e) {
  msg.value = true;
  addedDeposit.value = e;
}
</script>

<style scoped></style>
