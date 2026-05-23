<script setup lang="ts">
  import type { Component } from "vue";
  import { SoundEffects, soundManager } from "@/services/sound/SoundManager";

  const props = withDefaults(
    defineProps<{
      buttonClass: string;
      icon: Component;
      label: string;
      onClick: () => void;
      type?: "button" | "submit" | "reset";
      soundEffect?: SoundEffects;
      disabled?: boolean;
    }>(),
    {
      type: "button",
      soundEffect: SoundEffects.CLICK,
      disabled: false,
    },
  );

  function reactToClick() {
    if (props.disabled) {
      return;
    }

    soundManager.playEffect(props.soundEffect);
    props.onClick();
  }
</script>

<template>
  <button :type="type" :class="buttonClass" :disabled="disabled" @click="reactToClick">
    <component :is="icon" class="size-5" aria-hidden="true" />
    {{ label }}
  </button>
</template>
