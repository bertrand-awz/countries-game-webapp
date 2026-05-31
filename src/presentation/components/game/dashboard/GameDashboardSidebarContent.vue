<script setup lang="ts">
  import { ref } from "vue";
  import { useI18n } from "vue-i18n";

  import GameIconAndTitle from "./sidebarContents/GameIconAndTitle.vue";
  import SoundController from "./sidebarContents/soundController/SoundController.vue";
  import GameSettings from "./sidebarContents/gameSettings/GameSettings.vue";
  import type { SoundManager } from "@/domain/game/ports/SoundManager.ts";
  import ScoresDisplayer from "./sidebarContents/scoreDisplayer/ScoresDisplayer.vue";
  import type { GameState } from "@/domain/game/models/state/GameState.ts";

  defineProps<{
    soundManager: SoundManager;
    gameState: GameState;
  }>();

  const { t } = useI18n();

  const playersCount = ref(2);
  const timerMinutes = ref(5);
</script>

<template>
  <div class="sidebar-content">
    <GameIconAndTitle :translate="t" />

    <nav class="flex flex-1 flex-col gap-8">
      <ScoresDisplayer
        :translator="t"
        :opponents="gameState.players"
        :player="gameState.players[0]"
        :found-countries-by-continent-progressions="gameState.continents"
      />
      <SoundController :translator="t" :sound-manager="soundManager" />
      <GameSettings v-model:players-count="playersCount" v-model:timer-minutes="timerMinutes" />
    </nav>
  </div>
</template>
