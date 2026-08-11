<template>
  <v-form
    ref="form"
    class="bg-black pa-2 rounded"
    @submit.prevent="submitDiposit"
  >
    <h2 class="text-center">Update diposit</h2>
    <v-text-field
      type="number"
      hide-spin-buttons
      label="Enter Amount"
      v-model="diposit.amount"
      density="compact"
      :rules="rules"
      @keydown="(v) => ['e', '+', '-'].includes(v.key)"
      class="w-75 mx-auto"
    />
    <v-date-input
      class="mx-auto w-75"
      v-model="diposit.date"
      density="compact"
      label="Pick the date you diposited"
      :rules="rules"
    />
    <v-text-field
      type="time"
      label="Pick the time you diposited"
      class="mx-auto w-75"
      density="compact"
      :rules="rules"
      v-model="diposit.time"
    />
    <v-btn type="submit" class="w-75 mx-auto bg-primary" :loading="isLoading">
      Submit
    </v-btn>
  </v-form>
</template>

<script setup>
const diposit = reactive({});

const rules = [(v) => !!v || "the field is required"];

const form = useTemplateRef("form");
const isLoading = ref(false);

const emit = defineEmits(["updated"]);

async function submitDiposit() {
  const { valid } = await form.value.validate();
  if (!valid) return;
  isLoading.value = true;

  const date = new Date(diposit.date);
  const time = diposit.time.split(":");
  date.setHours(time[0]);
  date.setMinutes(time[1]);

  try {
    const res = await $fetch("/api/diposit", {
      method: "POST",
      body: {
        amount: parseInt(diposit.amount, 10),
        dipositDate: new Date(date),
      },
    });
    emit("updated", res);
  } catch (err) {
    console.log(err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped></style>
