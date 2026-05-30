<script setup lang="ts">
  import { MenuIcon } from "@lucide/vue";
  import LanguagesMenu from "@/presentation/components/common/NavbarLanguagesMenu.vue";

  import RestartAndExitButtons from "./navbarContents/RestartAndExitButtons.vue";
  import Timer from "./navbarContents/TimerDisplayer.vue";
  import ScoreDisplayer from "./navbarContents/ScoreDisplayer.vue";
  import { GameStatus } from "@/domain/game/models/state/GameState.ts";

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
    default: () => GameStatus.WAITING,
  });

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
                @resume-game="resume"
                @pause-game="pause"
                @start-game="start"
              />
            </div>

            <!-- Center -->
            <div class="flex flex-1 items-center justify-center">
              <ScoreDisplayer :score="5" />
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
