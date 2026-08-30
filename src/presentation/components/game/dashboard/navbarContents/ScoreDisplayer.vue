<script setup lang="ts">
  import { ref, watch } from "vue";

  import CountUp from "@/presentation/components/partials/CountUp.vue";

  const COUNT_UP_DURATION_IN_SECONDS = 0.7;

  const props = defineProps<{
    score: number;
  }>();

  const countUpFrom = ref(props.score);
  const countUpTo = ref(props.score);
  const shouldAnimateScore = ref(false);

  watch(
    () => props.score,
    (nextScore, previousScore) => {
      const shouldCountUp = nextScore > previousScore;

      countUpFrom.value = shouldCountUp ? previousScore : nextScore;
      countUpTo.value = nextScore;
      shouldAnimateScore.value = shouldCountUp;
    },
  );
</script>

<template>
  <div class="navbar-score-displayer tabular-nums">
    <CountUp
      :from="countUpFrom"
      :to="countUpTo"
      :duration="COUNT_UP_DURATION_IN_SECONDS"
      :start-when="shouldAnimateScore"
    />
  </div>
</template>
