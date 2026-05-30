<script setup lang="ts">
  import type { Player } from "@/domain/game/models/Player.ts";
  import { User2Icon, Users2Icon } from "@lucide/vue";
  defineProps<{
    translator: (translationKey: string) => string;
  }>();
  const player = defineModel<Player>("player", {
    required: true,
  });
  const opponents = defineModel<Player[]>("opponents", { required: true });
</script>

<template>
  <div>
    <div>
      <div class="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
        <div class="flex items-center gap-x-2">
          <User2Icon class="size-4 text-amber-300" />
          <h3 class="font-medium">{{ translator("GAME.SCORE_DISPLAYER.YOUR_SCORE") }}</h3>
        </div>

        <span class="font-bold"> {{ player.getScore() }} </span>
      </div>
    </div>
    <div>
      <div class="inline-flex h-full w-full items-center gap-x-2 text-sm font-medium">
        <Users2Icon class="size-4 text-yellow-300" />
        <h3 class="font-medium">{{ translator("GAME.SCORE_DISPLAYER.OPPONENTS_SCORES") }}</h3>
      </div>

      <div class="rounded-lg bg-white/5 px-3 py-2">
        <ul class="flex items-center justify-between">
          <li v-for="opponent in opponents" :key="opponent.getId()" class="flex-1 justify-between">
            <span class="text-sm font-medium text-gray-200">{{ opponent.getUsername() }} </span>

            <span class="text-sm font-bold text-white"> {{ opponent.getScore() }} </span>
          </li>
        </ul>

        <p class="mt-1 text-xs text-gray-400">Score général</p>
      </div>
    </div>
  </div>
</template>
