<script setup lang="ts">
  import type { GameState } from "@/domain/game/models/state/GameState.ts";
  import type { SoundManager } from "@/domain/game/ports/SoundManager.ts";
  import type { GameSetting } from "@/domain/game/settings";

  import GameIconAndTitle from "./sidebarContents/GameIconAndTitle.vue";
  import GameSettings from "./sidebarContents/gameSettings/GameSettings.vue";
  import ScoresDisplayer from "./sidebarContents/scoreDisplayer/ScoresDisplayer.vue";
  import SoundController from "./sidebarContents/soundController/SoundController.vue";

  defineProps<{
    soundManager: SoundManager;
    gameState: GameState;
    roomId: string | null;
    translator: (translationKey: string) => string;
    applySettingCallback: (newSetting: GameSetting) => void;
  }>();
</script>

<template>
  <div class="sidebar-content">
    <GameIconAndTitle :translate="translator" />

    <nav class="flex flex-1 flex-col gap-8">
      <ScoresDisplayer
        :translator="translator"
        :opponents="gameState.players"
        :player="gameState.players[0]"
        :found-countries-by-continent-progressions="gameState.continents"
      />
      <SoundController :translator="translator" :sound-manager="soundManager" />
      <GameSettings
        :translator="translator"
        :room-id="roomId"
        :game-duration-in-minutes="Math.round(gameState.durationInSeconds / 60)"
        :max-players-allowed="gameState.maxPlayersAllowed"
        :turn-duration-in-seconds="gameState.turnDurationInSeconds"
        :apply-setting-callback="applySettingCallback"
      />
    </nav>
  </div>
</template>
