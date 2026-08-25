<script setup lang="ts">
  import type { Country } from "@/domain/game/models/Country.ts";
  import InteractiveGlobe from "@/presentation/components/game/dashboard/gameboardContents/globe/InteractiveGlobe.vue";

  import CountryNameAnswerInputForm from "./dashboard/gameboardContents/CountryNameAnswerInputForm.vue";

  defineProps<{
    countryNameAnswerSubmitter: (playerAnswer: string) => void;
    countriesFeatures: Country[];
    canAnswer: boolean;
    answerInputFocusToken: string;
    answerInputClearToken: number;
    highlightedCountryId: string | null;
    foundCountryIds: string[];
  }>();
</script>

<template>
  <section class="game-board">
    <CountryNameAnswerInputForm
      :on-submit-callback="countryNameAnswerSubmitter"
      :is-active="canAnswer"
      :focus-token="answerInputFocusToken"
      :clear-token="answerInputClearToken"
    />
    <div class="game-board-map">
      <InteractiveGlobe
        :countries="countriesFeatures"
        :highlighted-country-id="highlightedCountryId"
        :found-country-ids="foundCountryIds"
      />
    </div>
  </section>
</template>
