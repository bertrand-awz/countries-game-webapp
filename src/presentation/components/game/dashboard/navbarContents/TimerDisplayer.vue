<script setup lang="ts">
  import { computed, ref } from "vue";
  import { TimerIcon, PlayIcon, PauseIcon } from "@lucide/vue";
  import ClickableSoundButton from "./ClickableSoundButton.vue";

  const emit = defineEmits<{
    "pause-game": [];
    "resume-game": [];
  }>();

  const props = defineProps<{
    translator: (translationKey: string) => string;
    timeLeftInSeconds: number;
    showTimer: boolean;
  }>();

  const isPaused = ref(false);

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

  function togglePause() {
    isPaused.value = !isPaused.value;

    if (isPaused.value) {
      emit("pause-game");
    } else {
      emit("resume-game");
    }
  }
</script>

<template>
  <div :class="timerVisibilityClass" class="shrink-0 items-center gap-4">
    <div class="navbar-timer-container" :class="timerStateClass">
      <TimerIcon class="size-5" aria-hidden="true" />
      <span>{{ formattedTime }}</span>
    </div>

    <ClickableSoundButton
      :button-class="isPaused ? 'navbar-continue-button' : 'navbar-pause-button'"
      :icon="isPaused ? PlayIcon : PauseIcon"
      :label="isPaused ? translator('APP.PLAY') : translator('APP.PAUSE')"
      :on-click="togglePause"
    />
  </div>
</template>
