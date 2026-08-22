<script setup lang="ts">
  import { ref } from "vue";

  import type { Country } from "@/domain/game/models/Country.ts";
  import InteractiveGlobe from "@/presentation/components/game/dashboard/gameboardContents/globe/InteractiveGlobe.vue";

  import CountryNameAnswerInputForm from "./dashboard/gameboardContents/CountryNameAnswerInputForm.vue";

  defineProps<{
    countryNameAnswerSubmitter: (playerAnswer: string) => void;
    countriesFeatures: Country[];
    answerInputFocusToken: string;
  }>();

  const countryId = ref("");
</script>

<template>
  <section class="game-board">
    <CountryNameAnswerInputForm
      :on-submit-callback="countryNameAnswerSubmitter"
      :focus-token="answerInputFocusToken"
    />
    <div class="game-board-map">
      <InteractiveGlobe :countries="countriesFeatures" :highlighted-country-id="countryId" />
    </div>
  </section>
</template>
