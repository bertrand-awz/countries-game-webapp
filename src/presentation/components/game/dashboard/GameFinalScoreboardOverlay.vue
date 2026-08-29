<script setup lang="ts">
  import { DoorOpenIcon, MedalIcon, PlayIcon, TrophyIcon } from "@lucide/vue";
  import { computed } from "vue";

  import type { Player } from "@/domain/game/models/Player.ts";
  import type { GameState } from "@/domain/game/models/state/GameState.ts";

  const props = defineProps<{
    gameState: GameState;
    currentPlayerId: string | null;
    translator: (translationKey: string, values?: Record<string, string | number>) => string;
    requestRestart: () => void;
    exitGame: () => void | Promise<void>;
  }>();

  const rankedPlayers = computed<Player[]>(() => {
    return [...props.gameState.players].sort((firstPlayer, secondPlayer) => {
      const scoreDifference = secondPlayer.getScore() - firstPlayer.getScore();

      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      return secondPlayer.getCountriesFoundNumber() - firstPlayer.getCountriesFoundNumber();
    });
  });

  const totalCountriesFound = computed(() => {
    return props.gameState.continents.reduce((total, continent) => {
      return total + continent.countriesFoundNumber;
    }, 0);
  });

  const podiumMedals = [
    {
      label: "1",
      className: "border-amber-300/40 bg-amber-300/10 text-amber-200 ring-amber-300/30",
      ariaLabel: "Gold medal",
    },
    {
      label: "2",
      className: "border-slate-200/40 bg-slate-200/10 text-slate-100 ring-slate-200/30",
      ariaLabel: "Silver medal",
    },
    {
      label: "3",
      className: "border-orange-300/40 bg-orange-300/10 text-orange-200 ring-orange-300/30",
      ariaLabel: "Bronze medal",
    },
  ] as const;

  function isCurrentPlayer(player: Player): boolean {
    return player.getId() === props.currentPlayerId;
  }

  function getPodiumMedal(playerIndex: number) {
    return podiumMedals[playerIndex] ?? null;
  }
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 text-white">
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true"></div>

    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="final-scoreboard-title"
      class="relative w-full max-w-4xl overflow-hidden rounded-lg border border-white/15 bg-neutral-950/95 shadow-2xl shadow-black/60"
    >
      <div
        class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-300 via-cyan-300 to-amber-300"
      ></div>

      <header
        class="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="flex min-w-0 items-center gap-3">
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-md bg-amber-300/10 text-amber-200 ring-1 ring-amber-300/30"
          >
            <TrophyIcon class="size-6" aria-hidden="true" />
          </div>

          <div class="min-w-0">
            <p class="text-xs font-semibold text-cyan-200 uppercase">
              {{ translator("GAME.FINAL_SCOREBOARD.MATCH_COMPLETE") }}
            </p>
            <h2
              id="final-scoreboard-title"
              class="mt-1 text-2xl font-bold tracking-normal sm:text-3xl"
            >
              {{ translator("GAME.FINAL_SCOREBOARD.TITLE") }}
            </h2>
          </div>
        </div>
      </header>

      <div class="grid gap-3 border-b border-white/10 px-5 py-4 sm:grid-cols-2 sm:px-6">
        <div class="rounded-md bg-white/5 px-3 py-3">
          <p class="text-xs text-gray-400">{{ translator("GAME.FINAL_SCOREBOARD.PLAYERS") }}</p>
          <p class="mt-1 text-xl font-bold">{{ gameState.players.length }}</p>
        </div>

        <div class="rounded-md bg-white/5 px-3 py-3">
          <p class="text-xs text-gray-400">
            {{ translator("GAME.FINAL_SCOREBOARD.COUNTRIES_FOUND") }}
          </p>
          <p class="mt-1 text-xl font-bold">{{ totalCountriesFound }}</p>
        </div>
      </div>

      <div class="max-h-[55vh] overflow-auto px-5 py-5 sm:px-6">
        <table class="w-full min-w-[36rem] border-separate border-spacing-y-2 text-left text-sm">
          <thead class="text-xs text-gray-500 uppercase">
            <tr>
              <th scope="col" class="w-16 px-3 py-2">
                {{ translator("GAME.FINAL_SCOREBOARD.RANK") }}
              </th>
              <th scope="col" class="px-3 py-2">
                {{ translator("GAME.FINAL_SCOREBOARD.PLAYER") }}
              </th>
              <th scope="col" class="px-3 py-2 text-right">
                {{ translator("GAME.FINAL_SCOREBOARD.SCORE") }}
              </th>
              <th scope="col" class="px-3 py-2 text-right">
                {{ translator("GAME.FINAL_SCOREBOARD.COUNTRIES_FOUND") }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(player, index) in rankedPlayers"
              :key="player.getId()"
              class="bg-white/5 text-gray-100"
              :class="isCurrentPlayer(player) ? 'outline outline-1 outline-emerald-300/50' : ''"
            >
              <td class="rounded-l-md px-3 py-3 font-bold text-cyan-100">#{{ index + 1 }}</td>
              <td class="px-3 py-3">
                <div class="flex min-w-0 items-center gap-2">
                  <span class="truncate font-semibold">{{ player.getUsername() }}</span>
                  <span
                    v-if="isCurrentPlayer(player)"
                    class="rounded-sm bg-emerald-300/10 px-1.5 py-0.5 text-xs text-emerald-200"
                  >
                    {{ translator("GAME.FINAL_SCOREBOARD.YOU") }}
                  </span>
                  <span
                    v-if="getPodiumMedal(index)"
                    class="inline-flex size-7 shrink-0 items-center justify-center rounded-full border ring-1"
                    :class="getPodiumMedal(index)?.className"
                    :aria-label="getPodiumMedal(index)?.ariaLabel"
                    :title="getPodiumMedal(index)?.ariaLabel"
                  >
                    <MedalIcon class="size-4" aria-hidden="true" />
                    <span class="sr-only">{{ getPodiumMedal(index)?.label }}</span>
                  </span>
                </div>
              </td>
              <td class="px-3 py-3 text-right text-lg font-bold text-white">
                {{ player.getScore() }}
              </td>
              <td class="rounded-r-md px-3 py-3 text-right font-semibold text-gray-300">
                {{ player.getCountriesFoundNumber() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer
        class="flex flex-col-reverse gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:justify-end sm:px-6"
      >
        <button type="button" class="navbar-exit-button justify-center" @click="exitGame">
          <DoorOpenIcon class="size-5" aria-hidden="true" />
          {{ translator("APP.EXIT") }}
        </button>

        <button type="button" class="navbar-continue-button justify-center" @click="requestRestart">
          <PlayIcon class="size-5" aria-hidden="true" />
          {{ translator("GAME.FINAL_SCOREBOARD.PLAY_AGAIN") }}
        </button>
      </footer>
    </section>
  </div>
</template>
