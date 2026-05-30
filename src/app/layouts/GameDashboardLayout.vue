<script setup lang="ts">
  import GameSidebar from "@/presentation/components/game/dashboard/GameDashboardSidebar.vue";
  import GameNavbar from "@/presentation/components/game/dashboard/GameDashboardNavbar.vue";
  import { ref } from "vue";
  import GameBoard from "@/presentation/components/game/GameBoard.vue";
  import { useI18n } from "vue-i18n";
  import { GameStatus } from "@/domain/game/models/state/GameState.ts";
  import { Player } from "@/domain/game/models/Player.ts";
  import { howlerSoundManager } from "@/infrastructure/sound/HowlerSoundManager.ts";

  const { t } = useI18n();
  const sidebarOpen = ref(false);
  //const gameState = defineModel<GameState>("gameState", { required: true });

  const gameStatus = ref(GameStatus.WAITING);
  const player = new Player("Rat", "Bis");

  //TODO: delete this code when connected to the backend (and review lines 65 - 68)
  function start() {
    gameStatus.value = GameStatus.PLAYING;
  }
  function pause() {
    gameStatus.value = GameStatus.PAUSED;
  }
  function resume() {
    gameStatus.value = GameStatus.PLAYING;
  }
  //
</script>

<template>
  <div class="app-page">
    <GameNavbar
      v-model:player="player"
      :sidebar-opened="sidebarOpen"
      :translator="t"
      :game-status="gameStatus"
      :request-pause="pause"
      :request-resume="resume"
      :start-game="start"
      @open-sidebar="sidebarOpen = true"
    />
    <GameSidebar
      v-model:open="sidebarOpen"
      :translator="t"
      :sound-manager="howlerSoundManager"
      @update:open="sidebarOpen = false"
    />
    <GameBoard />
  </div>
</template>
