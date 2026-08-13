<template>
  <v-form
    ref="form"
    class="bg-black pa-2 rounded"
    @submit.prevent="submitDeposit"
  >
    <h2 class="text-center">Add deposit</h2>
    <v-select
      :items="depositorNames"
      label="Select Depositor Name"
      v-model="deposit.name"
      class="w-75 mx-auto"
      density="compact"
      :rules="rules"
      :disabled="namesLoading"
      :loading="namesLoading"
    />

    <v-text-field
      type="number"
      hide-spin-buttons
      label="Enter Amount"
      v-model="deposit.amount"
      density="compact"
      :rules="rules"
      @keydown="(v) => ['e', '+', '-'].includes(v.key)"
      class="w-75 mx-auto"
    />
    <v-date-input
      class="mx-auto w-75"
      v-model="deposit.date"
      density="compact"
      label="Pick the date he deposited"
      :rules="rules"
    />
    <v-text-field
      type="time"
      label="Pick the time he deposited"
      class="mx-auto w-75"
      density="compact"
      :rules="rules"
      v-model="deposit.time"
    />
    <v-alert
      v-if="errorMessage"
      type="error"
      :title="errorMessage"
      class="mx-auto my-2 w-75"
      closable
    >
    </v-alert>
    <div class="text-center">
      <v-btn type="submit" class="w-75 mx-auto bg-primary" :loading="isLoading">
        Submit
      </v-btn>
    </div>
  </v-form>
</template>

<script setup>
const deposit = reactive({});

const rules = [(v) => !!v || "the field is required"];

const namesLoading = ref(false);
const depositorNames = ref([]);
const errorMessage = ref("");

onMounted(async () => {
  namesLoading.value = true;
  try {
    const res = await $fetch("/api/memberName", {
      method: "GET",
    });
    res.forEach((name) => {
      const firstName =
        name.firstName.charAt(0).toUpperCase() + name.firstName.slice(1);
      const lastName =
        name.lastName.charAt(0).toUpperCase() + name.lastName.slice(1);

      depositorNames.value.push(`${firstName}${lastName}`);
    });
  } catch (err) {
    errorMessage.value = err.data?.message;
  } finally {
    namesLoading.value = false;
  }
});

const form = useTemplateRef("form");
const isLoading = ref(false);

const emit = defineEmits(["updated"]);

async function submitDeposit() {
  const { valid } = await form.value.validate();
  if (!valid) return;
  isLoading.value = true;

  const date = new Date(deposit.date);
  const time = deposit.time.split(":");
  date.setHours(time[0]);
  date.setMinutes(time[1]);

  try {
    const res = await $fetch("/api/addDeposit", {
      method: "POST",
      body: {
        name: deposit.name,
        amount: parseInt(deposit.amount, 10),
        depositDate: new Date(date),
      },
    });
    emit("updated", true);
  } catch (err) {
    emit("updated", false);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped></style>
