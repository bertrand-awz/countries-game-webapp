<script setup lang="ts">
  import type { Component } from "vue";
  import { soundManager } from "@/infrastructure/sound/HowlerSoundManager";
  import { SoundEffectName } from "@/domain/game/ports/SoundManager.ts";

  const props = withDefaults(
    defineProps<{
      buttonClass: string;
      icon: Component;
      label: string;
      actionOnClick: () => void;
      type?: "button" | "submit" | "reset";
      soundEffect?: SoundEffectName;
      disabled?: boolean;
    }>(),
    {
      type: "button",
      soundEffect: SoundEffectName.CLICK,
      disabled: false,
    },
  );

  function reactToClick() {
    if (props.disabled) {
      return;
    }
    soundManager.playEffect(props.soundEffect);
    props.actionOnClick();
  }
</script>

<template>
  <button :type="type" :class="buttonClass" :disabled="disabled" @click="reactToClick">
    <component :is="icon" class="size-5" aria-hidden="true" />
    {{ label }}
  </button>
</template>
