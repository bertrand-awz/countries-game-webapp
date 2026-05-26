<script setup lang="ts">
  import { BadgeCheckIcon, Globe2Icon, User2Icon, Users2Icon } from "@lucide/vue";
  import type { ContinentDetails } from "./types";
  const props = defineProps<{
    continentsDetails: ContinentDetails[];
  }>();
</script>

<template>
  <section class="space-y-4 text-center">
    <!-- Titre principal -->
    <div class="text-md/6 flex items-center gap-x-2 font-semibold">
      <BadgeCheckIcon class="size-5 text-indigo-400" />
      <h2 class="font-bold text-white">Scores</h2>
    </div>
    <!-- Scores personnels -->
    <div class="ml-2 gap-6 space-y-3 border-l border-white/10 pl-4">
      <div class="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
        <div class="flex items-center gap-x-2">
          <User2Icon class="size-4 text-amber-300" />
          <h3 class="text-sm font-medium text-gray-200">Biscuits</h3>
        </div>

        <span class="text-sm font-bold text-white"> 0 </span>
      </div>

      <!-- Liste des pays cités -->
      <div class="flex items-center gap-x-2">
        <Globe2Icon class="size-4 text-emerald-300" />
        <span class="text-sm font-medium text-gray-200"> Pays cités par continent </span>
      </div>
      <div class="rounded-lg bg-white/5 px-3 py-2">
        <ul class="mt-2 space-y-1 pl-6 text-sm text-gray-300">
          <li
            v-for="continent in continentsDetails"
            :key="continent.name"
            class="flex justify-between"
          >
            <span>{{ continent.name }}</span>
            <span class="font-semibold text-white">
              {{ continent.numberOfCountries }}
            </span>
          </li>
        </ul>
      </div>
      <div class="inline-flex h-full w-full items-center gap-x-2 text-sm font-medium">
        <Users2Icon class="size-4 text-yellow-300" />
        <h3>Adversaires</h3>
      </div>

      <div class="rounded-lg bg-white/5 px-3 py-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-200"> username adversaire </span>

          <span class="text-sm font-bold text-white"> 1 </span>
        </div>

        <p class="mt-1 text-xs text-gray-400">Score général</p>
      </div>
    </div>
  </section>
</template>
