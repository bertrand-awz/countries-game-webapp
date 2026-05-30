<script setup lang="ts">
  import { BadgeCheckIcon } from "@lucide/vue";
  import Scoreboard from "./Scoreboard.vue";
  import CountriesByContinent from "./CountriesByContinent.vue";
  import type { FoundingContinentProgressionState } from "@/domain/game/models/state/FoundingContinentProgressionState.ts";
  import type { Player } from "@/domain/game/models/Player.ts";
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
      <BadgeCheckIcon class="size-5 text-indigo-400" />
      <h2 class="font-bold">
        {{ translator("GAME.SIDEBAR.SCORE_DISPLAYER.TITLE") }}
      </h2>
    </div>

    <Scoreboard :translator="translator" :opponents="opponents" :player="player" />
    <CountriesByContinent
      :translator="translator"
      :founding-continent-progression-states="foundCountriesByContinentProgressions"
    />
  </section>
</template>
