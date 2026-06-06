<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import { ref } from "vue";
  import { useI18n } from "vue-i18n";

  import { useAppDependencies } from "@/app/composables/useAppDependencies.ts";
  import LoadingLayout from "@/app/layouts/LoadingLayout.vue";
  import { useGameMapStore } from "@/application/stores/gameMapStore.ts";
  import { useGameSessionStore } from "@/application/stores/gameSessionStore.ts";
  import {
    requestGamePauseUseCase,
    startGameUseCase,
    submitCountryNameAnswerUseCase,
  } from "@/application/use-cases";
  import type { GameSetting } from "@/domain/game/settings";
  import GameNavbar from "@/presentation/components/game/dashboard/GameDashboardNavbar.vue";
  import GameSidebar from "@/presentation/components/game/dashboard/GameDashboardSidebar.vue";
  import GameBoard from "@/presentation/components/game/GameBoard.vue";

  const { soundManager } = useAppDependencies();

  const { t } = useI18n();
  const gameMapStore = useGameMapStore();
  const gameSessionStore = useGameSessionStore();
  await gameMapStore.preload();
  const sidebarOpen = ref(false);

  const { currentPlayer, gameState } = storeToRefs(gameSessionStore);

  //TODO: delete this code when connected to the backend (and review lines 65 - 68)
  function start() {
    startGameUseCase.execute();
  }

  function pause() {
    requestGamePauseUseCase.execute();
  }

  function resume() {}

  function submitCountryNameAnswer(playerAnswer: string) {
    submitCountryNameAnswerUseCase.setOptions({ countryName: playerAnswer }).execute();
  }

  function applySettingCallback(newSetting: GameSetting) {
    void newSetting;
  }
</script>

<template>
  <div v-if="gameState && currentPlayer" class="app-page">
    <GameNavbar
      :player="currentPlayer"
      :sidebar-opened="sidebarOpen"
      :translator="t"
      :game-status="gameState.status"
      :request-pause="pause"
      :request-resume="resume"
      :start-game="start"
      @open-sidebar="sidebarOpen = true"
    />
    <GameSidebar
      v-model:open="sidebarOpen"
      :game-state="gameState"
      :translator="t"
      :sound-manager="soundManager"
      :apply-setting-callback="applySettingCallback"
      @update:open="sidebarOpen = false"
    />
    <GameBoard
      :country-name-answer-submitter="submitCountryNameAnswer"
      :countries-features="gameMapStore.getCountriesFeatures"
    />
  </div>

  <LoadingLayout v-else />
</template>
