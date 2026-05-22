<script setup lang="ts">
  import { BadgeCheckIcon, Globe2Icon, User2Icon, Users2Icon } from "@lucide/vue";
</script>

<template>
  <section class="space-y-4">
    <!-- Titre principal -->
    <div class="text-md/6 flex items-center gap-x-2 font-semibold">
      <BadgeCheckIcon class="size-5 text-indigo-400" />
      <h2 class="font-bold text-white">Scores</h2>
    </div>

    <!-- Scores personnels -->
    <div class="ml-2 space-y-3 border-l border-white/10 pl-4">
      <div class="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
        <div class="flex items-center gap-x-2">
          <User2Icon class="size-4 text-amber-300" />
          <span class="text-sm font-medium text-gray-200"> Biscuits </span>
        </div>

        <span class="text-sm font-bold text-white"> 0 </span>
      </div>

      <div class="rounded-lg bg-white/5 px-3 py-2">
        <div class="flex items-center gap-x-2">
          <Globe2Icon class="size-4 text-emerald-300" />
          <span class="text-sm font-medium text-gray-200"> Pays cités par continent </span>
        </div>

        <ul class="mt-2 space-y-1 pl-6 text-sm text-gray-300">
          <li class="flex justify-between">
            <span>Afrique</span>
            <span class="font-semibold text-white">0</span>
          </li>
          <li class="flex justify-between">
            <span>Europe</span>
            <span class="font-semibold text-white">0</span>
          </li>
          <li class="flex justify-between">
            <span>Asie</span>
            <span class="font-semibold text-white">0</span>
          </li>
          <li class="flex justify-between">
            <span>Amérique</span>
            <span class="font-semibold text-white">0</span>
          </li>
          <li class="flex justify-between">
            <span>Océanie</span>
            <span class="font-semibold text-white">0</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Scores adversaires -->
    <div class="ml-2 space-y-3 border-l border-white/10 pl-4">
      <div class="flex items-center gap-x-2 text-sm font-semibold text-gray-300">
        <Users2Icon class="size-4 text-yellow-300" />
        <span>Adversaires</span>
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
