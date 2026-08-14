let interval;
export async function useDeleteDeposit(deposit) {
  const timer = ref({
    isTimer: false,
    timeLeft: 10,
  });
  const hasDeleted = reactive({
    value: false,
    msg: "",
  });

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

  return {
    timer: timer.value,
    interval,
    hasDeleted,
  };
}
