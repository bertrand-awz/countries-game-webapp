<script setup lang="ts">
  import { RotateCcwIcon, DoorOpenIcon } from "@lucide/vue";
  import ClickableSoundButton from "./ClickableSoundButton.vue";

  defineProps<{
    translator: (translationKey: string) => string;
  }>();

  function recommencer() {}

  function quitter() {}
</script>

<template>
  <div class="flex shrink-0 gap-4">
    <ClickableSoundButton
      button-class="navbar-restart-button"
      :icon="RotateCcwIcon"
      :label="translator('APP.RESTART')"
      :on-click="recommencer"
    />

    <ClickableSoundButton
      button-class="navbar-exit-button"
      :icon="DoorOpenIcon"
      :label="translator('APP.EXIT')"
      :on-click="quitter"
    />
  </div>
</template>
