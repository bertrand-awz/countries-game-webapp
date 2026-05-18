<script setup lang="ts">
  import { RouterView } from "vue-router";
  import Navbar from "@/components/default/Navbar.vue";
</script>
<template>
  <div class="app-page">
    <Navbar />
    <main>
      <RouterView />
    </main>
  </div>
</template>
