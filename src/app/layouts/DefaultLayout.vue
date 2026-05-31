<script setup lang="ts">
  import { RouterView } from "vue-router";

  import Navbar from "@/presentation/components/default/Navbar.vue";
</script>
<template>
  <div class="app-page">
    <Navbar />
    <main>
      <RouterView />
    </main>
  </div>
</template>
