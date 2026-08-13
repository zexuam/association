<template>
  <div>
    <v-snackbar :model-value="props.slowNet" :timeout="10000">
      <span>{{ props.errMessage }}</span>

      <template #actions>
        <v-icon @click="props.slowNet = false">mdi-close</v-icon>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
const props = defineProps(["slowNet", "errMessage"]);
</script>

<style scoped></style>
