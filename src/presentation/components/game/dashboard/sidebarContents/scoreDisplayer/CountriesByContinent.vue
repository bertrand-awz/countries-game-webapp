<script setup lang="ts">
  import type { FoundingContinentProgressionState } from "@/domain/game/models/state/FoundingContinentProgressionState.ts";
  import { Globe2Icon } from "@lucide/vue";

  defineProps<{
    translator: (translationKey: string) => string;
  }>();

  const foundingContinentProgressionStates = defineModel<FoundingContinentProgressionState[]>(
    "foundingContinentProgressionStates",
    { required: true },
  );
</script>

<template>
  <div class="flex items-center gap-x-2">
    <Globe2Icon class="size-4 text-emerald-300" />
    <span class="text-sm font-medium text-gray-200">
      {{ translator("GAME.SCORE_DISPLAYER.TITLE") }}
    </span>
  </div>
  <div class="rounded-lg bg-white/5 px-3 py-2">
    <ul class="mt-2 space-y-1 pl-6 text-sm text-gray-300">
      <li
        v-for="fcps in foundingContinentProgressionStates"
        :key="fcps.continent.id"
        class="flex justify-between"
      >
        <span>{{ translator(fcps.continent.nameTranslationKey) }}</span>
        <span class="font-semibold text-white">
          {{ fcps.countriesFoundNumber }}
        </span>
      </li>
    </ul>
  </div>
</template>
