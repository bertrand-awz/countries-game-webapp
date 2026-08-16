<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import { computed, onBeforeUnmount, ref, watch } from "vue";
  import { useI18n } from "vue-i18n";

  import { useAppDependencies } from "@/app/composables/useAppDependencies.ts";
  import LoadingLayout from "@/app/layouts/LoadingLayout.vue";
  import { useGameMapStore } from "@/application/stores/gameMapStore.ts";
  import { useGameSessionStore } from "@/application/stores/gameSessionStore.ts";
  import {
    requestGamePauseUseCase,
    requestGameRestartUseCase,
    requestGameResumeUseCase,
    startGameUseCase,
    submitCountryNameAnswerUseCase,
    updateRoomSettingsUseCase,
  } from "@/application/use-cases";
  import { GameStatus } from "@/domain/game/models/state/GameState.ts";
  import type { GameSetting } from "@/domain/game/settings";
  import GameNavbar from "@/presentation/components/game/dashboard/GameDashboardNavbar.vue";
  import GameSidebar from "@/presentation/components/game/dashboard/GameDashboardSidebar.vue";
  import GameFinalScoreboardOverlay from "@/presentation/components/game/dashboard/GameFinalScoreboardOverlay.vue";
  import GameBoard from "@/presentation/components/game/GameBoard.vue";

  const { soundManager } = useAppDependencies();

  const { t } = useI18n();
  const gameMapStore = useGameMapStore();
  const gameSessionStore = useGameSessionStore();
  await gameMapStore.preload();
  const sidebarOpen = ref(false);
  const now = ref(Date.now());
  const pausedTimeLeftInSeconds = ref<number | null>(null);

  const { currentPlayer, gameState, roomId } = storeToRefs(gameSessionStore);
  const timerInterval = window.setInterval(() => {
    if (gameState.value?.status === GameStatus.PLAYING) {
      now.value = Date.now();
    }
  }, 250);

  const timeLeftInSeconds = computed(() => {
    const state = gameState.value;

    if (!state) {
      return 0;
    }

    if (state.status === GameStatus.WAITING) {
      return state.durationInSeconds;
    }

    if (state.status === GameStatus.PAUSED) {
      return pausedTimeLeftInSeconds.value ?? calculateTimeLeftInSeconds(state.endAt);
    }

    if (state.status === GameStatus.FINISHED) {
      return 0;
    }

    return calculateTimeLeftInSeconds(state.endAt);
  });

  watch(
    () => gameState.value?.status,
    (status, previousStatus) => {
      if (status === GameStatus.PLAYING) {
        pausedTimeLeftInSeconds.value = null;
        now.value = Date.now();
        soundManager.playMainThemeSound();
      } else if (status === GameStatus.PAUSED && previousStatus === GameStatus.PLAYING) {
        pausedTimeLeftInSeconds.value = calculateTimeLeftInSeconds(gameState.value?.endAt ?? 0);
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    window.clearInterval(timerInterval);
  });

  function start() {
    startGameUseCase.execute();
  }

  function pause() {
    requestGamePauseUseCase.execute();
  }

  function resume() {
    requestGameResumeUseCase.execute();
  }

  function restart() {
    requestGameRestartUseCase.execute();
  }

  function submitCountryNameAnswer(playerAnswer: string) {
    submitCountryNameAnswerUseCase.setOptions({ countryName: playerAnswer }).execute();
  }

  function applySettingCallback(newSetting: GameSetting) {
    updateRoomSettingsUseCase.setOptions(newSetting).execute();
  }

  function calculateTimeLeftInSeconds(endAt: number): number {
    return Math.max(0, Math.ceil((endAt - now.value) / 1000));
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
      :request-restart="restart"
      :start-game="start"
      :time-left-in-seconds="timeLeftInSeconds"
      @open-sidebar="sidebarOpen = true"
    />
    <GameSidebar
      v-model:open="sidebarOpen"
      :game-state="gameState"
      :room-id="roomId"
      :translator="t"
      :sound-manager="soundManager"
      :apply-setting-callback="applySettingCallback"
      @update:open="sidebarOpen = false"
    />
    <GameBoard
      :country-name-answer-submitter="submitCountryNameAnswer"
      :countries-features="gameMapStore.getCountriesFeatures"
    />
    <GameFinalScoreboardOverlay
      v-if="gameState.status === GameStatus.FINISHED"
      :game-state="gameState"
      :current-player-id="gameSessionStore.playerId"
      :translator="t"
      :request-restart="restart"
    />
  </div>

  <LoadingLayout v-else />
</template>
