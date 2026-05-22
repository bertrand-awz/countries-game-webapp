<script setup lang="ts">
  import { RotateCcwIcon, DoorOpenIcon } from "@lucide/vue";

  defineProps<{
    i18nTranslator: (translationKey: string) => string;
  }>();
</script>

<template>
  <div class="flex shrink-0">
    <button type="button" class="navbar-restart-button">
      <RotateCcwIcon class="size-5" aria-hidden="true" />
      {{ i18nTranslator("APP.RESTART") }}
    </button>
  </div>

  <div class="flex shrink-0">
    <button type="button" class="navbar-exit-button">
      <DoorOpenIcon class="size-5" aria-hidden="true" />
      {{ i18nTranslator("APP.EXIT") }}
    </button>
  </div>
</template>
