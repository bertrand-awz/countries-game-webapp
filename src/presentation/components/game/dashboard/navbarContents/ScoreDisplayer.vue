<script setup lang="ts">
  import { onBeforeUnmount, ref, watch } from "vue";

  const COUNT_UP_DURATION_MS = 700;

  const props = defineProps<{
    score: number;
  }>();

  const displayedScore = ref(props.score);

  let animationFrameId: number | null = null;

  watch(
    () => props.score,
    (nextScore) => {
      animateScoreChange(nextScore);
    },
  );

  onBeforeUnmount(() => {
    cancelScoreAnimation();
  });

  function animateScoreChange(nextScore: number): void {
    const startScore = displayedScore.value;

    cancelScoreAnimation();

    if (nextScore <= startScore || shouldReduceMotion()) {
      displayedScore.value = nextScore;
      return;
    }

    const startedAt = performance.now();
    const scoreDelta = nextScore - startScore;

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(1, elapsed / COUNT_UP_DURATION_MS);
      const easedProgress = easeOutCubic(progress);

      displayedScore.value = Math.round(startScore + scoreDelta * easedProgress);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(tick);
        return;
      }

      displayedScore.value = nextScore;
      animationFrameId = null;
    };

    animationFrameId = window.requestAnimationFrame(tick);
  }

  function cancelScoreAnimation(): void {
    if (animationFrameId === null) {
      return;
    }

    window.cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  function easeOutCubic(progress: number): number {
    return 1 - Math.pow(1 - progress, 3);
  }

  function shouldReduceMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
</script>

<template>
  <div class="navbar-score-displayer tabular-nums">
    {{ displayedScore }}
  </div>
</template>
