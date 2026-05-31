<script setup lang="ts">
  import Scoreboard from "./Scoreboard.vue";
  import CountriesByContinent from "./CountriesByContinent.vue";
  import type { FoundingContinentProgressionState } from "@/domain/game/models/state/FoundingContinentProgressionState.ts";
  import type { Player } from "@/domain/game/models/Player.ts";
  import { TrophyIcon } from "@lucide/vue";

  defineProps<{
    translator: (translationKey: string) => string;
    foundCountriesByContinentProgressions: FoundingContinentProgressionState[];
    opponents: Player[];
    player: Player;
  }>();
</script>

<template>
  <section class="score-displayer">
    <div class="text-md/6 flex items-center gap-x-2 font-semibold">
      <TrophyIcon class="size-5" />
      <h2 class="font-bold">
        {{ translator("GAME.SIDEBAR.SCORE_DISPLAYER.TITLE") }}
      </h2>
    </div>
    <div class="ml-2 space-y-4 border-l border-white/10 pl-4">
      <Scoreboard :translator="translator" :opponents="opponents" :player="player" />
      <CountriesByContinent
        :translator="translator"
        :founding-continent-progression-states="foundCountriesByContinentProgressions"
      />
    </div>
  </section>
</template>
