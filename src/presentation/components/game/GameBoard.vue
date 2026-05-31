<script setup lang="ts">
  import type { Country } from "@/domain/game/models/Country.ts";

  import CountryNameAnswerInputForm from "./dashboard/gameboardContents/CountryNameAnswerInputForm.vue";

  defineProps<{
    countryNameAnswerSubmitter: (playerAnswer: string) => void;
    countriesFeatures: Country[];
  }>();
</script>

<template>
  <section class="game-board">
    <CountryNameAnswerInputForm :on-submit-callback="countryNameAnswerSubmitter" />
    <div class="game-board-map"></div>
  </section>
</template>
