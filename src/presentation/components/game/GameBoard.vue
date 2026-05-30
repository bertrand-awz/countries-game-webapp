<script setup lang="ts">
  import CountryNameAnswerInputForm from "./dashboard/gameboardContents/CountryNameAnswerInputForm.vue";
  function a(k: string) {
    console.log(k);
  }
</script>

<template>
  <section class="game-board">
    <CountryNameAnswerInputForm :on-submit-callback="a" />
    <div class="game-board-map"></div>
  </section>
</template>
