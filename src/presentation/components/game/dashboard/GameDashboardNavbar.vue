<script setup lang="ts">
  import { MenuIcon } from "@lucide/vue";
  import LanguagesMenu from "@/presentation/components/common/NavbarLanguagesMenu.vue";

  import RestartAndExitButtons from "./navbarContents/RestartAndExitButtons.vue";
  import Timer from "./navbarContents/TimerDisplayer.vue";
  import ScoreDisplayer from "./navbarContents/ScoreDisplayer.vue";
  import { GameStatus } from "@/domain/game/models/state/GameState.ts";
  import type { Player } from "@/domain/game/models/Player.ts";

  defineProps<{
    sidebarOpened: boolean;
    translator: (translationKey: string) => string;
    requestPause: () => void;
    requestResume: () => void;
    startGame: () => void;
  }>();

  defineEmits<{
    "open-sidebar": [];
  }>();

  const gameStatus = defineModel<GameStatus>("gameStatus", {
    required: true,
  });

  const player = defineModel<Player>("player", { required: true });
</script>

<template>
  <div class="lg:pl-72">
    <nav class="navbar sticky top-0 z-40">
      <div class="navbar-container">
        <div class="navbar-content">
          <div class="mr-4 items-center lg:hidden" :class="sidebarOpened ? 'hidden' : 'flex'">
            <!-- Mobile sidebar button -->
            <button
              type="button"
              class="navbar-change-language-button"
              @click="$emit('open-sidebar')"
            >
              <span class="sr-only">Open sidebar</span>
              <MenuIcon class="size-6" aria-hidden="true" />
            </button>
          </div>

          <div class="flex flex-1 items-center gap-3 md:gap-4">
            <!-- Left side -->
            <div class="flex flex-1 items-center justify-start gap-3 md:gap-4">
              <Timer
                :time-left-in-seconds="100"
                :translator="translator"
                :show-timer="!sidebarOpened"
                :game-status="gameStatus"
                @resume-game="requestResume"
                @pause-game="requestPause"
                @start-game="startGame"
              />
            </div>

            <!-- Center -->
            <div class="flex flex-1 items-center justify-center">
              <ScoreDisplayer :score="player.getScore()" />
            </div>

            <!-- Right side -->
            <div class="flex flex-1 items-center justify-end gap-3 md:gap-4">
              <RestartAndExitButtons :translator="translator" />
              <LanguagesMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
