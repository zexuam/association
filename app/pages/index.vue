<template>
  <div
    class="bg-black rounded mx-auto pa-2"
    style="max-width: 600px; width: 100%"
  >
    <div v-if="Object.keys(totalClients).length === 0">
      <v-skeleton-loader type="list-item-three-line" />
      <v-divider class="ma-3" />
      <v-skeleton-loader type="list-item-three-line" />
      <v-divider class="ma-3" />
      <v-skeleton-loader type="list-item-three-line" />
      <v-divider class="ma-3" />
    </div>
    <v-list v-else>
      <template v-for="(value, client) of totalClients" :key="client">
        <v-list-item class="my-2" :to="`/${client}`">
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

          <template #append>
            <v-tooltip text="Notify Him">
              <template #activator="{ props }">
                <v-icon @click="console.log('Hi')" v-bind="props">
                  mdi-bell
                </v-icon>
              </template>
            </v-tooltip>
          </template>
        </v-list-item>
        <v-divider class="ma-2" />
      </template>
    </v-list>
  </div>
  <SlowNet :slowNet="slowNet" :errMessage="errMessage" />
</template>

<script setup>
const totalClients = reactive({});

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
    console.log(totalClients);

    // console.log(xx);
  } catch (err) {
    console.log(err, err.data);
    slowNet.value = true;
    errMessage.value = err.data.statusMessage;
  }
});

// async function getAmount(name) {
//   try {
//     const res = await $fetch("/api/gettingAmounts", {
//       method: "POST",
//       body: { name },
//     });

//     totalClients[name].amount = res.amount;
//     totalClients[name].totalDeposits = res.totalDeposits;
//     console.log(totalClients);
//   } catch (err) {
//     console.log(err.data?.message);
//     totalClients[name].error = err.data?.message;
//   }
// }
</script>

<style scoped></style>
