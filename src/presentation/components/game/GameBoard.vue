<script setup lang="ts">
  import { ref, watch } from "vue";

  import type { Country } from "@/domain/game/models/Country.ts";
  import InteractiveGlobe from "@/presentation/components/game/dashboard/gameboardContents/globe/InteractiveGlobe.vue";

  import CountryNameAnswerInputForm from "./dashboard/gameboardContents/CountryNameAnswerInputForm.vue";

  const props = defineProps<{
    countryNameAnswerSubmitter: (playerAnswer: string) => void;
    countriesFeatures: Country[];
    answerInputFocusToken: string;
    highlightedCountryId: string | null;
    foundCountryIds: string[];
  }>();

  const countryId = ref<string | null>(null);

  watch(
    () => props.highlightedCountryId,
    (highlightedCountryId) => {
      countryId.value = highlightedCountryId;
    },
    { immediate: true },
  );
</script>

<template>
  <section class="game-board">
    <CountryNameAnswerInputForm
      :on-submit-callback="countryNameAnswerSubmitter"
      :focus-token="answerInputFocusToken"
    />
    <div class="game-board-map">
      <InteractiveGlobe
        v-model:highlighted-country-id="countryId"
        :countries="countriesFeatures"
        :found-country-ids="foundCountryIds"
      />
    </div>
  </section>
</template>
