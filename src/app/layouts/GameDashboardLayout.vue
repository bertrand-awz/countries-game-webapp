<script setup lang="ts">
  import GameSidebar from "@/presentation/components/game/dashboard/GameDashboardSidebar.vue";
  import GameNavbar from "@/presentation/components/game/dashboard/GameDashboardNavbar.vue";
  import { ref } from "vue";
  import GameBoard from "@/presentation/components/game/GameBoard.vue";
  import { useI18n } from "vue-i18n";

  const { t } = useI18n();
  const sidebarOpen = ref(false);
</script>

<template>
  <div class="app-page">
    <GameNavbar :sidebar-opened="sidebarOpen" :translator="t" @open-sidebar="sidebarOpen = true" />
    <GameSidebar v-model:open="sidebarOpen" :translator="t" @update:open="sidebarOpen = false" />
    <GameBoard />
  </div>
</template>
