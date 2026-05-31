<script setup lang="ts">
  import { ref } from "vue";

  import { GameInputConstraints } from "@/domain/game/constraints/gameInputConstraints.ts";

  const props = defineProps<{
    onSubmitCallback: (inputValue: string) => void;
  }>();

  const countryNameAnswer = ref("");

  function onSubmit(): void {
    const trimmedAnswer = countryNameAnswer.value.trim();

    if (!trimmedAnswer) {
      return;
    }

    props.onSubmitCallback(trimmedAnswer);
    countryNameAnswer.value = "";
  }
</script>

<template>
  <form id="answer-form" autocomplete="off" @submit.prevent="onSubmit">
    <div id="answer-input-container" class="answer-input-container">
      <input
        id="answer-input"
        v-model="countryNameAnswer"
        class="answer-input"
        placeholder="Type here..."
        autocomplete="off"
        :maxlength="GameInputConstraints.COUNTRY_NAME_MAX_LENGTH"
        @paste.prevent
        @drop.prevent
      />
    </div>
  </form>
</template>

<style scoped></style>
