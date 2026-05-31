<script setup lang="ts">
  import { ref } from "vue";

  import { GameInputConstraints } from "@/domain/game/constraints/gameInputConstraints.ts";

  const props = defineProps<{
    onSubmitCallback: (inputValue: string) => void;
  }>();

  const countryNameAnswer = ref("");
  const inputRef = ref<HTMLInputElement | null>(null);

  function focusInput(): void {
    inputRef.value?.focus();
  }

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
    <div id="answer-input-container" class="answer-input-container" @click="focusInput">
      <input
        id="answer-input"
        ref="inputRef"
        v-model="countryNameAnswer"
        class="answer-input-hidden"
        autocomplete="off"
        spellcheck="false"
        :maxlength="GameInputConstraints.COUNTRY_NAME_MAX_LENGTH"
        @paste.prevent
        @drop.prevent
      />

      <div class="answer-input-taker">
        <span v-if="countryNameAnswer">
          {{ countryNameAnswer }}
        </span>
        <span class="cyber-cursor">_</span>
      </div>
    </div>
  </form>
</template>
