<template>
  <div>
    <MobileNav v-if="mobile" />
    <DesktopNav v-else />
    <slot />
  </div>
</template>

<script setup>
const { mobile } = useDisplay();
</script>

<style scoped></style>
