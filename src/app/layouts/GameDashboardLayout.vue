<script setup lang="ts">
  import Sidebar from "@/presentation/components/game/dashboard/GameDashboardSidebar.vue";
  import Navbar from "@/presentation/components/game/dashboard/GameDashboardNavbar.vue";
  import { ref } from "vue";
  import GameBoard from "@/presentation/components/game/GameBoard.vue";
  const navigation = [];
  const teams = [];
  const userNavigation = [];
  const sidebarOpen = ref(false);
</script>

<template>
  <div class="app-page">
    <Sidebar
      v-model:open="sidebarOpen"
      :navigation="navigation"
      :teams="teams"
      @update:open="sidebarOpen = false"
    />

    <Navbar
      :user-navigation="userNavigation"
      :sidebar-opened="sidebarOpen"
      @open-sidebar="sidebarOpen = true"
    />

    <GameBoard />
  </div>
</template>
