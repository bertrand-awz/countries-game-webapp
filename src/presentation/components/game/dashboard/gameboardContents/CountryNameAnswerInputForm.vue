<script setup lang="ts">
  import { nextTick, ref, watch } from "vue";

  import { GameConstraints } from "@/domain/game/constraints/gameConstraints.js";

  const props = defineProps<{
    onSubmitCallback: (inputValue: string) => void;
    isActive: boolean;
    focusToken: string;
    clearToken: number;
  }>();

  const countryNameAnswer = ref("");
  const inputRef = ref<HTMLInputElement | null>(null);

  function focusInput(): void {
    if (!props.isActive) {
      return;
    }

    inputRef.value?.focus({ preventScroll: true });
  }

  watch(
    () => [props.focusToken, props.isActive] as const,
    async ([focusToken, isActive]) => {
      if (!focusToken || !isActive) {
        return;
      }

      await nextTick();
      focusInput();
    },
    { immediate: true },
  );

  watch(
    () => props.clearToken,
    () => {
      countryNameAnswer.value = "";
    },
  );

  function onSubmit(): void {
    if (!props.isActive) {
      return;
    }

    const trimmedAnswer = countryNameAnswer.value.trim();

    if (!trimmedAnswer) {
      return;
    }

    props.onSubmitCallback(trimmedAnswer);
    countryNameAnswer.value = "";
  }
</script>

<template>
  <form
    id="answer-form"
    autocomplete="off"
    :aria-hidden="!isActive"
    @submit.prevent="onSubmit"
  >
    <div id="answer-input-container" class="answer-input-container" @click="focusInput">
      <input
        id="answer-input"
        ref="inputRef"
        v-model="countryNameAnswer"
        class="answer-input-hidden"
        autocomplete="off"
        spellcheck="false"
        :disabled="!isActive"
        :maxlength="GameConstraints.COUNTRY_NAME_MAX_LENGTH"
        @paste.prevent
        @drop.prevent
      />

      <div class="answer-input-taker" :class="{ 'answer-input-taker-hidden': !isActive }">
        <span v-if="countryNameAnswer">
          {{ countryNameAnswer }}
        </span>
        <span class="cyber-cursor">_</span>
      </div>
    </div>
  </form>
</template>
