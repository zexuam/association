<template>
  <div
    class="bg-black rounded mx-auto pa-2"
    style="max-width: 600px; width: 100%"
  >
    <v-skeleton-loader
      v-if="isLoading"
      type="table-thead, table-tbody, table-tfoot"
    />
    <v-table
      v-else
      fixed-header
      class="text-center w-100"
      fixed-footer
      style="max-height: 80vh; overflow-y: auto"
    >
      <thead>
        <tr>
          <th v-if="isAdmin" class="text-center">Delete</th>
          <th class="text-center">Serial</th>
          <th class="text-center">Name</th>
          <th class="text-center">Diposit</th>
          <th class="text-center">Date</th>
          <th class="text-center">Note</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(diposit, i) of diposits" :key="diposit._id">
          <td v-if="isAdmin">
            <v-tooltip location="top" text="This field will be deleted!">
              <template #activator="{ props }">
                <v-btn
                  @click="deleteDeposit(diposit)"
                  v-bind="props"
                  variant="tonal"
                  disabled
                >
                  <v-icon color="red" style="font-size: 1.4rem"
                    >mdi-delete</v-icon
                  >
                </v-btn>
              </template>
            </v-tooltip>
          </td>
          <td>{{ i + 1 }}</td>
          <td>{{ diposit.name }}</td>
          <td>
            {{
              Number(diposit.amount).toLocaleString("bn-BD", {
                style: "currency",
                currency: "BDT",
                minimumFractionDigits: 0,
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
          <td v-if="isAdmin"></td>
          <td class="pe-0">
            <v-btn
              v-if="auth.isLoggedIn && isAdmin"
              class="mx-0 bg-primary"
              size="small"
              @click="dialog = !dialog"
              text="Add New"
            />

            <NuxtLink
              v-else-if="!auth.isLoggedIn"
              to="/login"
              style="text-decoration: none"
            >
              <v-btn class="bg-error" text="Login"></v-btn>
            </NuxtLink>
          </td>
          <td></td>
          <td>Total</td>
          <td>
            {{
              Number(totalAmount).toLocaleString("bn-BD", {
                style: "currency",
                currency: "BDT",
              })
            }}
          </td>
          <td>
            Total
            <h3 class="ma-0" style="color: blue">
              {{ totalDeposits }}
            </h3>
            Deposits
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
  <v-snackbar
    v-model="timer.isTimer"
    :loading="true"
    :timeout="-1"
    :title="'Name: ' + timer?.name"
  >
    <div>
      <p class="my-0 text-subtitle-1">Amount: {{ timer?.amount }}</p>
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
const auth = useAuthStore();
const dialog = ref(false);
const diposits = ref([]);
const isLoading = ref(false);

const totalAmount = ref(0);
const totalDeposits = ref(0);
const error = ref("");

const isAdmin = ref(false);

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

  try {
    const res = await $fetch("/api/addNewbtn", { method: "GET" });
    if (res === true) {
      isAdmin.value = true;
    }
  } catch (err) {
    isAdmin.value = false;
  }
});

const timer = ref({
  isTimer: false,
  timeLeft: 10,
});
let interval;

const hasDeleted = reactive({
  value: false,
  msg: "",
});

function deleteDeposit(deposit) {
  const sure = confirm(
    `Are you sure want to delete ${deposit.name}?\n Amount is ${deposit.amount}\n Note is '${deposit.note}'`,
  );
  if (sure) {
    clearInterval(interval);
    timer.value.isTimer = true;
    timer.value.name = deposit.name;
    timer.value.amount = String(deposit.amount);

    interval = setInterval(async () => {
      if (timer.value.timeLeft > 0) {
        timer.value.timeLeft--;
      } else {
        clearInterval(interval);

        try {
          const res = await $fetch("/api/deleteField", {
            method: "POST",
            body: {
              _id: deposit._id,
            },
          });
          timer.value.isTimer = false;
          hasDeleted.value = true;
          hasDeleted.msg = res.message;
        } catch (err) {
          timer.value.isTimer = false;
          hasDeleted.value = true;
          hasDeleted.msg = err.data?.message;
        } finally {
          timer.value.timeLeft = 10;
        }
      }
    }, 1000);
  }
}

function stopDeletion() {
  clearInterval(interval);
  timer.value.isTimer = false;
  timer.value.timeLeft = 10;
}

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
