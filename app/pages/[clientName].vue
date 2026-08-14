<template>
  <div
    class="bg-black rounded mx-auto pa-2 d-flex flex-column ga-3"
    style="max-width: 600px; width: 100%"
  >
    <div v-if="fields.length === 0">
      <v-divider class="ma-3" />
      <v-skeleton-loader
        type="list-item, list-item, list-item, list-item, button"
      />
      <v-skeleton-loader
        type="list-item, list-item, list-item, list-item, button"
      />
      <v-skeleton-loader
        type="list-item, list-item, list-item, list-item, button"
      />
    </div>

    <template v-else>
      <v-card v-for="(field, i) in fields" :key="field._id">
        <template #prepend>
          <span>{{ field.dipositTimes }}. No Deposit</span>
        </template>
        <v-card-item>
          <v-card-title>
            <h2 class="my-1">{{ field.name.split(/(?=[A-Z])/).join(" ") }}</h2>
          </v-card-title>
          <v-card-subtitle class="my-1"
            >Deposited at:
            <strong>
              {{
                Temporal.Instant.from(field.dipositDate).toLocaleString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  },
                )
              }}
            </strong>
          </v-card-subtitle>
          <v-card-subtitle>
            Amount was:
            <strong> {{ field.amount }}৳ </strong>
          </v-card-subtitle>

          <v-text-field
            label="Note"
            density="compact"
            class="mt-3"
            variant="outlined"
            v-model="field.note"
            persistent-placeholder
          />
          <v-btn class="my-0 bg-primary">Update Note</v-btn>
          <template v-if="isAdmin && i === 0" #append>
            <v-btn @click="deleteDeposit(field)">
              <v-icon color="red" style="font-size: 1.3rem">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-card-item>
      </v-card>
    </template>
  </div>
  <SlowNet :slowNet="slowNet" :errMessage="errMessage" />
  <v-snackbar
    v-model="timer.isTimer"
    :loading="true"
    :timeout="-1"
    :title="'Name: ' + timer?.name"
  >
    <div>
      <p class="my-0 text-subtitle-1">Amount: {{ timer?.amount }}৳</p>
      <p class="my-0 text-body-2" style="color: red">Is being deleted</p>
    </div>
    <template #actions>
      <h4 class="mx-4">{{ timer.timeLeft }}</h4>
      <v-btn variant="elevated" color="primary" @click="stopDeletion"
        >Stop Deletion</v-btn
      >
    </template>
  </v-snackbar>
  <v-snackbar v-model="hasDeleted.value">
    <div>{{ hasDeleted.msg }}</div>
  </v-snackbar>
</template>

<script setup>
import { Temporal } from "temporal-polyfill";
const route = useRoute();
const fields = ref([]);

const auth = useAuthStore();
const isAdmin = ref(false);

const slowNet = ref(false);
const errMessage = ref("");

onMounted(async () => {
  try {
    const res = await $fetch("/api/singleClient", {
      method: "POST",
      body: {
        name: route.params.clientName,
      },
    });
    fields.value = res;
  } catch (err) {
    slowNet.value = true;
    errMessage.value = err.data.statusMessage;
  }
  isAdmin.value = await auth.isAdmin();
});

const hasDeleted = ref({});
const timer = ref({});
let interval;

async function deleteDeposit(field) {
  const composable = await useDeleteDeposit(field);
  hasDeleted.value = composable.hasDeleted;
  timer.value = composable.timer;
  interval = composable.interval;
}
function stopDeletion() {
  clearInterval(interval);
  timer.value.isTimer = false;
  timer.value.timeLeft = 10;
}
</script>

<style scoped></style>
