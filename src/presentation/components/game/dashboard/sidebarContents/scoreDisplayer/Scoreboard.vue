<script setup lang="ts">
  import { User2Icon, Users2Icon } from "@lucide/vue";

  import type { Player } from "@/domain/game/models/Player.ts";
  import { getPlayerColorBulletStyle } from "@/presentation/components/game/playerColorPalette.ts";

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
    <div class="mb-4 border-b pb-1.5">
      <div class="flex items-center justify-between rounded-lg">
        <div class="flex items-center gap-x-2">
          <User2Icon class="size-4 text-amber-300" />
          <h3 class="text-sm font-semibold">
            {{ translator("GAME.SIDEBAR.SCORE_DISPLAYER.YOUR_SCORE") }}
          </h3>
          <span
            class="size-2.5 shrink-0 rounded-full"
            :style="getPlayerColorBulletStyle(player.getColorSlot())"
            aria-hidden="true"
          ></span>
        </div>

        <span class="font-bold"> {{ player.getScore() }} </span>
      </div>
    </div>

    <div class="">
      <div class="mb-4 flex items-center gap-x-2">
        <Users2Icon class="size-4 text-yellow-300" />
        <h3 class="text-sm font-semibold">
          {{ translator("GAME.SIDEBAR.SCORE_DISPLAYER.OPPONENTS_SCORES") }}
        </h3>
      </div>

      <div class="rounded-lg bg-white/5 px-3 py-2">
        <ul class="flex-1 flex-row items-center justify-between">
          <li
            v-for="opponent in opponents"
            :key="opponent.getId()"
            class="mb-2 flex w-full justify-between last:mb-0"
          >
            <span class="flex min-w-0 items-center gap-x-2 text-sm font-medium">
              <span class="truncate">{{ opponent.getUsername() }}</span>
              <span
                class="size-2.5 shrink-0 rounded-full"
                :style="getPlayerColorBulletStyle(opponent.getColorSlot())"
                aria-hidden="true"
              ></span>
            </span>
            <span class="text-sm font-bold"> {{ opponent.getScore() }} </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
