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
      <template v-for="(value, client) of totalClients" :key="client">
        <v-list
          class="py-0 rounded d-flex align-center justify-space-around"
          v-if="client !== 'TestingPurpose'"
        >
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
          <v-tooltip text="Make Favorite">
            <template #activator="{ props }">
              <v-btn icon variant="outlined" color="pink">
                <v-icon
                  @click="addToFav(client, value)"
                  v-bind="props"
                  icon="mdi-heart"
                />
              </v-btn>
            </template>
          </v-tooltip>
        </v-list>
        <v-divider class="my-2" :thickness="2" />
      </template>
    </template>
  </div>
  <SlowNet :slowNet="slowNet" :errMessage="errMessage" />
  <v-snackbar v-model="addedFav.value" :timeout="10000">
    <span class="clientName">
      <b>{{ addedFav.name.split(/(?=[A-Z])/).join(" ") }}</b>
      Added to Favourite
    </span>

    <template #actions>
      <v-icon @click="addedFav.value = false">mdi-close</v-icon>
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

onMounted(async () => {
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
  } catch (err) {
    console.log(err, err.data);
    slowNet.value = true;
    errMessage.value = err.data.statusMessage;
  }
});

const addedFav = reactive({
  value: false,
  name: null,
});
function addToFav(client, value) {
  const res = useLocalStorage(client, value.amount);
  if (res.value) {
    addedFav.value = true;
    addedFav.name = client;
  }
}
</script>

<style scoped>
.clientName {
  text-transform: capitalize;
}
</style>
