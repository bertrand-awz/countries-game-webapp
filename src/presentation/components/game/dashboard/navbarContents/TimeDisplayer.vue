<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { PauseIcon, PlayIcon, TimerIcon } from "@lucide/vue";
  import ClickableSoundButton from "./ClickableSoundButton.vue";
  import { GameStatus } from "@/domain/game/models/state/GameState.ts";
  import { soundManager } from "@/infrastructure/sound/HowlerSoundManager.ts";
  import { LoopableSoundEffectName } from "@/domain/game/ports/SoundManager.ts";

  const emit = defineEmits<{
    "pause-game": [];
    "resume-game": [];
    "start-game": [];
  }>();

  const props = defineProps<{
    translator: (translationKey: string) => string;
    timeLeftInSeconds: number;
    showTimer: boolean;
  }>();

  const formattedTime = computed(() => {
    const minutes = Math.floor(props.timeLeftInSeconds / 60);
    const seconds = props.timeLeftInSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  });

  const timerVisibilityClass = computed(() => {
    if (props.showTimer) {
      return "flex";
    }
    return "hidden";
  });

  const clickableButtonTranslationKey = computed(() => {
    if (gameStatus.value === GameStatus.WAITING || gameStatus.value === GameStatus.FINISHED) {
      return "GAME.NAVBAR.BUTTON_ACTION.START";
    } else if (gameStatus.value === GameStatus.PAUSED) {
      return "GAME.NAVBAR.BUTTON_ACTION.CONTINUE";
    } else {
      return "GAME.NAVBAR.BUTTON_ACTION.PAUSE";
    }
  });

  const gameStatus = defineModel<GameStatus>("gameStatus", { required: true });

  const isPaused = ref(gameStatus.value === GameStatus.PAUSED);

  const timerStateClass = computed(() => {
    const classes: string[] = [];

    if (!isPaused.value) {
      classes.push("animate-pulse");
    }

    if (props.timeLeftInSeconds <= 150) {
      classes.push("navbar-timer-container-alert-mode");
    } else if (props.timeLeftInSeconds <= 300) {
      classes.push("navbar-timer-container-warning-mode");
    }

    return classes.join(" ");
  });

  function toggleClickableButton() {
    if (gameStatus.value === GameStatus.WAITING || gameStatus.value === GameStatus.FINISHED) {
      emit("start-game");
      return;
    }

    isPaused.value = !isPaused.value;

    if (isPaused.value) {
      emit("pause-game");
      return;
    } else {
      emit("resume-game");
      return;
    }
  }

  const buttonContinue = computed(() => {
    return (
      isPaused.value ||
      gameStatus.value === GameStatus.WAITING ||
      gameStatus.value === GameStatus.FINISHED
    );
  });
  watch(
    () => props.timeLeftInSeconds,
    (timeLeftInSeconds) => {
      if (timeLeftInSeconds > 0 && timeLeftInSeconds <= 180) {
        soundManager.playEffectInLoop(LoopableSoundEffectName.TIMER_COUNTDOWN);
        return;
      }

      soundManager.stopLoopableEffect(LoopableSoundEffectName.TIMER_COUNTDOWN);
    },
    { immediate: true },
  );
</script>

<template>
  <div :class="timerVisibilityClass" class="shrink-0 items-center gap-4">
    <div class="navbar-timer-container" :class="timerStateClass">
      <TimerIcon class="size-5" aria-hidden="true" />
      <span>{{ formattedTime }}</span>
    </div>

    <ClickableSoundButton
      :button-class="buttonContinue ? 'navbar-continue-button' : 'navbar-pause-button'"
      :icon="buttonContinue ? PlayIcon : PauseIcon"
      :label="translator(clickableButtonTranslationKey)"
      :action-on-click="toggleClickableButton"
    />
  </div>
</template>
