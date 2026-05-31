<script setup lang="ts">
  import { Globe2Icon } from "@lucide/vue";

  import type { FoundingContinentProgressionState } from "@/domain/game/models/state/FoundingContinentProgressionState.ts";

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
    <h3 class="text-sm font-semibold">
      {{ translator("GAME.SIDEBAR.SCORE_DISPLAYER.COUNTRIES_BY_CONTINENT") }}
    </h3>
  </div>
  <div class="rounded-lg bg-white/5 px-3 py-2">
    <ul class="mt-2 space-y-1 text-sm">
      <li
        v-for="fcps in foundingContinentProgressionStates"
        :key="fcps.continent.id"
        class="mb-2 flex justify-between last:mb-0"
      >
        <span>{{ translator(`GAME.CONTINENT_NAME.${fcps.continent.id}`) }}</span>
        <span> {{ fcps.countriesFoundNumber }} / {{ fcps.continent.countriesNumber }} </span>
      </li>
    </ul>
  </div>
</template>
