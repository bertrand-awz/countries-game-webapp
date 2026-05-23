<script setup lang="ts">
  import { RotateCcwIcon, DoorOpenIcon } from "@lucide/vue";
  import ClickableSoundButton from "./ClickableSoundButton.vue";

  defineProps<{
    i18nTranslator: (translationKey: string) => string;
  }>();

  function recommencer() {}

  function quitter() {}
</script>

<template>
  <div class="flex shrink-0 gap-4">
    <ClickableSoundButton
      button-class="navbar-restart-button"
      :icon="RotateCcwIcon"
      :label="i18nTranslator('APP.RESTART')"
      :on-click="recommencer"
    />

    <ClickableSoundButton
      button-class="navbar-exit-button"
      :icon="DoorOpenIcon"
      :label="i18nTranslator('APP.EXIT')"
      :on-click="quitter"
    />
  </div>
</template>
