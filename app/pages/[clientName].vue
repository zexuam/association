<template>
  <div
    class="bg-black rounded mx-auto pa-2 d-flex flex-column ga-3"
    style="max-width: 600px; width: 100%"
  >
    <div v-if="fields.length === 0">
      <v-skeleton-loader type="text, text, text, text, text, text" />
      <v-divider class="ma-3" />
      <v-skeleton-loader type="text, text, text, text, text, text" />
      <v-divider class="ma-3" />
      <v-skeleton-loader type="text, text, text, text, text, text" />
    </div>

    <template v-else>
      <v-card v-for="(field, i) in fields" :key="field._id">
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
            <v-btn>
              <v-icon color="red" style="font-size: 1.3rem">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-card-item>
      </v-card>
    </template>
  </div>
  <SlowNet :slowNet="slowNet" :errMessage="errMessage" />
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
</script>

<style scoped></style>
