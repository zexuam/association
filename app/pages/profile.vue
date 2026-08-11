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
</script>

<style scoped></style>
