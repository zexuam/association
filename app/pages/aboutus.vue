<template>
  <div
    class="bg-black rounded mx-auto pa-2 d-flex flex-column ga-3"
    style="max-width: 600px; width: 100%"
  >
    <h1>President</h1>
    <v-list class="rounded">
      <v-list-item>
        <template #prepend>
          <v-avatar size="140">
            <v-img src="/icon-512.png" width="200" height="200" />
          </v-avatar>
        </template>
        <v-list-item-title style="font-size: 2rem">
          This is title
        </v-list-item-title>
        <v-list-item-subtitle style="font-size: 1.2rem">
          This is subtitle
        </v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <h1>hello</h1>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup></script>

<style scoped></style>
