<script setup lang="ts">
  import { DoorOpenIcon, RotateCcwIcon } from "@lucide/vue";

  import ClickableSoundButton from "./ClickableSoundButton.vue";

  defineProps<{
    translator: (translationKey: string) => string;
    requestRestart: () => void;
  }>();

  function quitter() {}
</script>

<template>
  <div class="flex shrink-0 gap-4">
    <ClickableSoundButton
      button-class="navbar-restart-button"
      :icon="RotateCcwIcon"
      :label="translator('APP.RESTART')"
      :on-click-callback="requestRestart"
    />

    <ClickableSoundButton
      button-class="navbar-exit-button"
      :icon="DoorOpenIcon"
      :label="translator('APP.EXIT')"
      :on-click-callback="quitter"
    />
  </div>
</template>
