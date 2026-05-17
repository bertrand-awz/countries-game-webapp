<script setup lang="ts">
  import { RouterView } from "vue-router";
  import Navbar from "../components/default/Navbar.vue";
</script>
<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <Navbar />
    <main>
      <RouterView />
    </main>
  </div>
</template>
