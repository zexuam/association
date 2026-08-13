export async function useNames() {
  const namesLoading = ref(false);
  const depositorNames = ref([]);
  const errorMessage = ref("");
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

  return {
    loading: namesLoading.value,
    names: depositorNames.value,
    err: errorMessage.value,
  };
}
