<script setup lang="ts">
  import Sidebar from "@/presentation/components/game/dashboard/GameDashboardSidebar.vue";
  import Navbar from "@/presentation/components/game/dashboard/GameDashboardNavbar.vue";
  import { ref } from "vue";
  import GameBoard from "@/presentation/components/game/GameBoard.vue";

  const sidebarOpen = ref(false);
</script>

<template>
  <div class="app-page">
    <Sidebar v-model:open="sidebarOpen" @update:open="sidebarOpen = false" />
    <Navbar :sidebar-opened="sidebarOpen" @open-sidebar="sidebarOpen = true" />
    <GameBoard />
  </div>
</template>
