<script setup lang="ts">
  import type { Component } from "vue";

  const props = withDefaults(
    defineProps<{
      buttonClass: string;
      icon: Component;
      label: string;
      onClickCallback: () => void;
      type?: "button" | "submit" | "reset";
      disabled?: boolean;
    }>(),
    {
      type: "button",
      disabled: false,
    },
  );

  function reactToClick() {
    if (props.disabled) {
      return;
    }

    props.onClickCallback();
  }
</script>

<template>
  <button :type="type" :class="buttonClass" :disabled="disabled" @click="reactToClick">
    <component :is="icon" class="size-5" aria-hidden="true" />
    {{ label }}
  </button>
</template>
