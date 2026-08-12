<template>
  <v-form
    ref="form"
    class="bg-black pa-2 rounded"
    @submit.prevent="submitDiposit"
  >
    <h2 class="text-center">Add diposit</h2>
    <v-select
      :items="dipositorNames"
      label="Select Dipositor Name"
      v-model="diposit.name"
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
      label="Pick the date he diposited"
      :rules="rules"
    />
    <v-text-field
      type="time"
      label="Pick the time he diposited"
      class="mx-auto w-75"
      density="compact"
      :rules="rules"
      v-model="diposit.time"
    />
    <v-alert
      v-if="errorMessage"
      type="error"
      :title="errorMessage"
      class="mx-auto my-2 w-75"
      closable
    >
    </v-alert>
    <v-btn type="submit" class="w-75 mx-auto bg-primary" :loading="isLoading">
      Submit
    </v-btn>
  </v-form>
</template>

<script setup>
const diposit = reactive({});

const rules = [(v) => !!v || "the field is required"];

const namesLoading = ref(false);
const dipositorNames = ref([]);
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

      dipositorNames.value.push(`${firstName}${lastName}`);
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
        name: diposit.name,
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
