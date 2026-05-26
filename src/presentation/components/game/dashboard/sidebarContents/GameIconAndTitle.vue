<script setup lang="ts">
  import GameIcon from "@/assets/icons/gameIcon.svg";

  defineProps<{
    translate: (key: string) => string;
  }>();
</script>

<template>
  <div class="flex h-16 shrink-0 items-center gap-2">
    <GameIcon class="size-10" />

    <h1 class="text-lg font-bold text-white">
      {{ translate("APP.NAME") }}
    </h1>
  </div>
</template>
