<script setup lang="ts">
  import { ref } from "vue";
  import { useI18n } from "vue-i18n";

  import { useGameMapStore } from "@/application/stores/gameMapStore.ts";
  import { submitCountryNameAnswerUseCase } from "@/application/use-cases";
  import { Player } from "@/domain/game/models/Player.ts";
  import { createFoundingContinentProgressiveStatesForContinents } from "@/domain/game/models/state/FoundingContinentProgressionState.ts";
  import { GameState, GameStatus } from "@/domain/game/models/state/GameState.ts";
  import { howlerSoundManager } from "@/infrastructure/sound/HowlerSoundManager.ts";
  import GameNavbar from "@/presentation/components/game/dashboard/GameDashboardNavbar.vue";
  import GameSidebar from "@/presentation/components/game/dashboard/GameDashboardSidebar.vue";
  import GameBoard from "@/presentation/components/game/GameBoard.vue";

  const { t } = useI18n();
  const gameMapStore = useGameMapStore();
  await gameMapStore.preload();
  const sidebarOpen = ref(false);

  const gameStatus = ref(GameStatus.WAITING);

  const players = [new Player("player-1", "Bertrand"), new Player("player-2", "Alice")];

  const durationInSeconds = 180;
  const startAt = Date.now();
  const endAt = startAt + durationInSeconds * 1000;

  const gameState = new GameState(
    players.length,
    "en",
    durationInSeconds,
    startAt,
    endAt,
    GameStatus.WAITING,
    createFoundingContinentProgressiveStatesForContinents(gameMapStore.getContinents),
    true,
    players,
  );

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

  function submitCountryNameAnswer(playerAnswer: string) {
    submitCountryNameAnswerUseCase.setOptions({ countryName: playerAnswer }).execute();
  }
</script>

<template>
  <div class="app-page">
    <GameNavbar
      v-model:player="gameState.players[0]"
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
      v-model:game-state="gameState"
      :translator="t"
      :sound-manager="howlerSoundManager"
      @update:open="sidebarOpen = false"
    />
    <GameBoard
      :country-name-answer-submitter="submitCountryNameAnswer"
      :countries-features="gameMapStore.getCountriesFeatures"
    />
  </div>
</template>
