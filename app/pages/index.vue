<template>
  <div>home</div>
</template>

<script setup>
onMounted(async () => {
  await navigateTo("/association");
});
</script>

<style scoped></style>
