<script setup lang="ts">
  import { ClockIcon, DoorOpenIcon, PlusCircleIcon, UsersIcon } from "@lucide/vue";
  import { computed } from "vue";

  import type { WaitingPlayer } from "@/domain/game/models/WaitingPlayer.ts";

  const props = defineProps<{
    waitingPlayer: WaitingPlayer;
    waitingPlayers: WaitingPlayer[];
    timeLeftInSeconds: number;
    translator: (translationKey: string, values?: Record<string, string | number>) => string;
    createRoom: () => void | Promise<void>;
    leaveQueue: () => void | Promise<void>;
  }>();

  const playerPosition = computed(() => {
    const index = props.waitingPlayers.findIndex((player) => player.id === props.waitingPlayer.id);

    return index >= 0 ? index + 1 : 1;
  });

  const formattedTimeLeft = computed(() => {
    const timeLeft = Math.max(0, props.timeLeftInSeconds);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    if (minutes <= 0) {
      return props.translator("GAME.WAITING_QUEUE.LESS_THAN_ONE_MINUTE");
    }

    return props.translator("GAME.WAITING_QUEUE.TIME_LEFT", {
      minutes,
      seconds: seconds.toString().padStart(2, "0"),
    });
  });

  const canCreateRoomFromQueue = computed(() => {
    return props.waitingPlayers.length >= 2;
  });
</script>

<template>
  <section class="flex min-h-screen items-center justify-center bg-black px-4 py-8 text-white">
    <div class="w-full max-w-3xl rounded-lg border border-white/10 bg-neutral-950 shadow-2xl">
      <header class="border-b border-white/10 px-5 py-5 sm:px-6">
        <p class="text-xs font-semibold tracking-widest text-emerald-300 uppercase">
          {{ translator("GAME.WAITING_QUEUE.EYEBROW") }}
        </p>
        <h1 class="mt-2 text-2xl font-bold text-white">
          {{ translator("GAME.WAITING_QUEUE.TITLE") }}
        </h1>
        <p class="mt-2 text-sm text-gray-400">
          {{ translator("GAME.WAITING_QUEUE.DESCRIPTION") }}
        </p>
      </header>

      <div class="grid gap-4 px-5 py-5 sm:grid-cols-3 sm:px-6">
        <div class="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3">
          <div class="flex items-center gap-2 text-sm text-gray-400">
            <UsersIcon class="size-4 text-cyan-300" aria-hidden="true" />
            {{ translator("GAME.WAITING_QUEUE.POSITION_LABEL") }}
          </div>
          <p class="mt-2 text-2xl font-bold text-white">
            {{
              translator("GAME.WAITING_QUEUE.POSITION", {
                position: playerPosition,
                total: waitingPlayers.length,
              })
            }}
          </p>
        </div>

        <div class="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 sm:col-span-2">
          <div class="flex items-center gap-2 text-sm text-gray-400">
            <ClockIcon class="size-4 text-yellow-300" aria-hidden="true" />
            {{ translator("GAME.WAITING_QUEUE.ESTIMATE_LABEL") }}
          </div>
          <p class="mt-2 text-2xl font-bold text-white">
            {{
              timeLeftInSeconds > 0
                ? formattedTimeLeft
                : translator("GAME.WAITING_QUEUE.NEXT_ROUND")
            }}
          </p>
        </div>
      </div>

      <div class="px-5 pb-5 sm:px-6">
        <h2 class="text-sm font-semibold text-gray-300">
          {{ translator("GAME.WAITING_QUEUE.PLAYERS_TITLE") }}
        </h2>
        <ol class="mt-3 divide-y divide-white/10 rounded-md border border-white/10">
          <li
            v-for="(player, index) in waitingPlayers"
            :key="player.id"
            class="flex items-center justify-between gap-3 px-4 py-3"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-white">
                {{ index + 1 }}. {{ player.username }}
              </p>
              <p v-if="player.id === waitingPlayer.id" class="mt-1 text-xs text-emerald-300">
                {{ translator("GAME.WAITING_QUEUE.YOU") }}
              </p>
            </div>
          </li>
        </ol>
      </div>

      <footer
        class="flex flex-col-reverse gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:justify-end sm:px-6"
      >
        <button type="button" class="navbar-exit-button justify-center" @click="leaveQueue">
          <DoorOpenIcon class="size-5" aria-hidden="true" />
          {{ translator("APP.EXIT") }}
        </button>

        <button
          v-if="canCreateRoomFromQueue"
          type="button"
          class="navbar-restart-button justify-center"
          @click="createRoom"
        >
          <PlusCircleIcon class="size-5" aria-hidden="true" />
          {{ translator("GAME.WAITING_QUEUE.CREATE_ROOM") }}
        </button>
      </footer>
    </div>
  </section>
</template>
