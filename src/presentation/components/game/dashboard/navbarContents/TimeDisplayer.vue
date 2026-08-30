<script setup lang="ts">
  import { PauseIcon, PlayIcon, TimerIcon } from "@lucide/vue";
  import { computed } from "vue";

  import { GameConstraints } from "@/domain/game/constraints/gameConstraints.ts";
  import { GameStatus } from "@/domain/game/models/state/GameState.ts";

  import ClickableSoundButton from "./ClickableSoundButton.vue";

  const emit = defineEmits<{
    "pause-game": [];
    "resume-game": [];
    "start-game": [];
  }>();

  const props = defineProps<{
    translator: (translationKey: string) => string;
    timeLeftInSeconds: number;
    totalDurationInSeconds: number;
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

  const warningThresholdInSeconds = computed(() => {
    return toDurationPercentageThreshold(
      props.totalDurationInSeconds,
      GameConstraints.TIMER_WARNING_REMAINING_TIME_PERCENTAGE,
    );
  });

  const alertThresholdInSeconds = computed(() => {
    return toDurationPercentageThreshold(
      props.totalDurationInSeconds,
      GameConstraints.TIMER_ALERT_REMAINING_TIME_PERCENTAGE,
    );
  });

  const timerStateClass = computed(() => {
    const classes: string[] = [];

    if (gameStatus.value === GameStatus.PLAYING) {
      classes.push("animate-pulse");
    }

    if (props.timeLeftInSeconds <= alertThresholdInSeconds.value) {
      classes.push("navbar-timer-container-alert-mode");
    } else if (props.timeLeftInSeconds <= warningThresholdInSeconds.value) {
      classes.push("navbar-timer-container-warning-mode");
    }

    return classes.join(" ");
  });

  function toggleClickableButton() {
    if (gameStatus.value === GameStatus.WAITING || gameStatus.value === GameStatus.FINISHED) {
      emit("start-game");
      return;
    }

    if (gameStatus.value === GameStatus.PLAYING) {
      emit("pause-game");
      return;
    }

    if (gameStatus.value === GameStatus.PAUSED) {
      emit("resume-game");
    }
  }

  const buttonContinue = computed(() => {
    return (
      gameStatus.value === GameStatus.PAUSED ||
      gameStatus.value === GameStatus.WAITING ||
      gameStatus.value === GameStatus.FINISHED
    );
  });

  function toDurationPercentageThreshold(durationInSeconds: number, percentage: number): number {
    return Math.ceil(durationInSeconds * (percentage / 100));
  }
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
      :on-click-callback="toggleClickableButton"
    />
  </div>
</template>
