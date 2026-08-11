<template>
  <div
    class="bg-black rounded mx-auto pa-2"
    style="max-width: 550px; width: 100%"
  >
    <v-skeleton-loader
      v-if="isLoading"
      type="table-thead, table-tbody, table-tfoot"
    />
    <v-table
      v-else
      fixed-header
      class="text-center"
      fixed-footer
      style="max-height: 80vh; overflow-y: auto"
    >
      <thead>
        <tr>
          <th class="text-center">{{ isLoading }}Name</th>
          <th class="text-center">Diposit</th>
          <th class="text-center">Date</th>
          <th class="text-center">Note</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="diposit of diposits" :key="diposit._id">
          <td>{{ diposit.name }}</td>
          <td>
            {{
              Number(diposit.amount).toLocaleString("bn-BD", {
                style: "currency",
                currency: "BDT",
              })
            }}
          </td>
          <td>{{ formatDateTime(diposit.dipositDate) }}</td>
          <td class="note" @click="openNoteModel(diposit._id)">
            {{ diposit.note }}
          </td>
        </tr>
      </tbody>
      <tfoot class="text-center">
        <tr>
          <td>Total</td>
          <td>
            {{
              Number(totalAmount).toLocaleString("bn-BD", {
                style: "currency",
                currency: "BDT",
              })
            }}
          </td>
          <td class="pe-0">
            <v-btn
              v-if="auth.isLoggedIn"
              class="mx-0 bg-primary"
              size="small"
              @click="dialog = !dialog"
            >
              Add New
            </v-btn>
            <NuxtLink v-else to="/login" style="text-decoration: none">
              <v-btn class="bg-error" text="Login"></v-btn>
            </NuxtLink>
          </td>
          <td>
            Total Deposit No.
            <strong>
              {{ totalDeposits }}
            </strong>
          </td>
        </tr>
      </tfoot>
    </v-table>
  </div>
  <v-dialog v-model="noteModel" style="max-width: 450px">
    <div class="bg-black pa-3 rounded">
      <v-textarea
        label="Write a note"
        v-model="note"
        :error-messages="noteError"
      />
      <v-btn @click="submitNote" class="w-100 bg-primary" :loading="noteLoading"
        >Submit</v-btn
      >
    </div>
  </v-dialog>
  <v-dialog v-model="dialog">
    <NewDiposit @updated="addToTable" />
  </v-dialog>
</template>

<script setup>
const auth = useAuthStore();
const dialog = ref(false);
const diposits = ref([]);
const isLoading = ref(false);

const totalAmount = ref(0);
const totalDeposits = ref(0);
const error = ref("");

onMounted(async () => {
  isLoading.value = true;
  try {
    const res = await $fetch("/api/diposits", {
      method: "GET",
    });
    diposits.value = res.diposits;
    res.diposits.forEach((deposit) => {
      totalAmount.value += deposit.amount;
      if (deposit.name === `${auth.user.firstName}${auth.user.lastName}`) {
        totalDeposits.value = deposit.dipositTimes;
      }
    });
  } catch (err) {
    error.value = err.data?.message;
  } finally {
    isLoading.value = false;
  }
});

const formatDateTime = (dateString) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

function addToTable(v) {
  dialog.value = false;
  totalDeposits.value = v.dipositTimes;
  diposits.value.push(v);
}

const noteModel = ref(false);
const note = ref("");
const id = ref(null);
const noteLoading = ref(false);

function openNoteModel(_id) {
  noteModel.value = true;
  id.value = _id;
}

const noteError = ref("");

async function submitNote() {
  if (!note.value) {
    return (noteError.value = "Please write a note first");
  }
  noteLoading.value = true;
  try {
    const res = await $fetch("/api/singleField", {
      method: "POST",
      body: {
        _id: id.value,
        note: note.value,
      },
    });
    noteModel.value = false;

    diposits.value.forEach((di) => {
      if (di._id === id.value) {
        di.note = note.value;
      }
    });
    note.value = "";
  } catch (err) {
    noteError.value = err.data?.message;
  } finally {
    noteLoading.value = false;
  }
}
</script>

<style scoped>
.note {
  cursor: pointer;
  text-transform: capitalize;
}
.note:hover {
  text-decoration: underline;
  background: grey;
}
</style>
