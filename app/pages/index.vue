<template>
  <div
    class="bg-black rounded mx-auto pa-2"
    style="max-width: 600px; width: 100%"
  >
    <div v-if="mounted && loader === 0">
      <template v-for="loader in 7" :key="loader">
        <v-skeleton-loader type="list-item-three-line" />
        <v-divider class="ma-3" />
      </template>
    </div>
    <template v-else>
      <v-row class="my-2">
        <v-col> Total Clients </v-col>
        <v-col class="text-end">{{ totalClientsLength }}</v-col>
      </v-row>
      <template v-if="pinnedItem?.name">
        <v-list
          class="py-0 rounded d-flex align-center justify-space-around bg-secondary"
        >
          <v-list-item
            class="py-4 rounded"
            style="width: 80%"
            :to="`/${pinnedItem?.name}`"
          >
            <v-list-item-title class="text-capitalize color-primary">
              {{ pinnedItem?.name?.split(/(?=[A-Z])/).join(" ") }}
            </v-list-item-title>

            <v-list-item-subtitle>
              Total deposit:-
              {{
                Number(pinnedItem?.amount).toLocaleString("bn-BD", {
                  style: "currency",
                  currency: "BDT",
                  minimumFractionDigits: 0,
                })
              }}
            </v-list-item-subtitle>
          </v-list-item>
          <v-tooltip text="Unpin">
            <template #activator="{ props }">
              <v-btn icon variant="plain" color="primary" v-bind="props">
                <v-icon
                  @click="addToPin('unpinned')"
                  v-bind="props"
                  size="24"
                  icon="mdi-pin-off-outline"
                  class="text-black"
                />
              </v-btn>
            </template>
          </v-tooltip>
        </v-list>
        <v-divider class="my-2" :thickness="2" />
      </template>
      <template v-for="(value, client) of totalClients" :key="client">
        <template
          v-if="client !== 'TestingPurpose' && pinnedItem?.name !== client"
        >
          <v-list class="py-0 rounded d-flex align-center justify-space-around">
            <v-list-item
              class="py-4 rounded"
              style="width: 80%"
              :to="`/${client}`"
            >
              <v-list-item-title class="text-capitalize">
                {{ client?.split(/(?=[A-Z])/).join(" ") }}
              </v-list-item-title>

              <v-list-item-subtitle>
                Total deposit:-
                {{
                  Number(value.amount).toLocaleString("bn-BD", {
                    style: "currency",
                    currency: "BDT",
                    minimumFractionDigits: 0,
                  })
                }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-tooltip text="Pin">
              <template #activator="{ props }">
                <v-btn icon variant="plain" color="primary" v-bind="props">
                  <v-icon
                    @click="addToPin(client, value)"
                    v-bind="props"
                    size="24"
                    icon="mdi-pin-outline"
                  />
                </v-btn>
              </template>
            </v-tooltip>
          </v-list>
          <v-divider class="my-2" :thickness="2" />
        </template>
      </template>
    </template>
  </div>
  <SlowNet :slowNet="slowNet" :errMessage="errMessage" />
  <v-snackbar v-model="addedPin.value" :timeout="10000">
    <span class="clientName">
      <b>{{ addedPin.name.split(/(?=[A-Z])/).join(" ") }}.</b>
      <h6 class="my-0" style="color: brown">Please Refresh the Page.</h6>
    </span>

    <template #actions>
      <v-icon @click="addedPin.value = false">mdi-close</v-icon>
    </template>
  </v-snackbar>
</template>

<script setup>
const totalClients = reactive({});
const mounted = ref(false);
const loader = computed(() => Object.keys(totalClients).length);
onMounted(() => {
  mounted.value = true;
});

const slowNet = ref(false);
const errMessage = ref("");
const pinnedItem = ref(null);
const totalClientsLength = ref(null);

onMounted(async () => {
  pinnedItem.value = JSON.parse(localStorage.getItem("pinned"));
  try {
    const res = await $fetch("/api/totalDeposits", { method: "GET" });

    res.forEach((field) => {
      if (!totalClients[field.name]) {
        totalClients[field.name] = {
          amount: 0,
        };
      }
      totalClients[field.name].amount += field.amount;
    });
    totalClientsLength.value = Object.keys(totalClients).length - 1;
  } catch (err) {
    console.log(err, err.data);
    slowNet.value = true;
    errMessage.value = err.data.statusMessage;
  }
});

const addedPin = reactive({
  value: false,
  name: null,
});
function addToPin(client, value) {
  if (client === "unpinned") {
    localStorage.removeItem("pinned");
    addedPin.value = true;
    addedPin.name = `${client} Remove From Pinned`;
    return;
  }
  localStorage.setItem(
    "pinned",
    JSON.stringify({ name: client, amount: value.amount }),
  );
  addedPin.value = true;
  addedPin.name = `${client} Added to Pinned`;
}
</script>

<style scoped>
.clientName {
  text-transform: capitalize;
}
</style>
