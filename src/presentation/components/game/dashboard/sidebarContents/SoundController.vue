<script setup lang="ts">
  import { MusicIcon, Volume2Icon, WandSparklesIcon } from "@lucide/vue";

  const mainVolume = defineModel<number>("mainVolume", {
    default: 70,
  });

  const effectsVolume = defineModel<number>("effectsVolume", {
    default: 80,
  });
</script>

<template>
  <section class="space-y-4">
    <!-- Titre principal -->
    <div class="text-md/6 flex items-center gap-x-2 font-semibold">
      <Volume2Icon class="sidebar-section-icon" />
      <h2 class="sidebar-section-title">Sons</h2>
    </div>

    <!-- Contrôles -->
    <div class="ml-2 space-y-4 border-l border-white/10 pl-4">
      <!-- Musique principale -->
      <div class="rounded-lg bg-white/5 px-3 py-3">
        <div class="mb-2 flex items-center justify-between">
          <div class="flex items-center gap-x-2">
            <MusicIcon class="size-4 text-sky-300" />
            <span class="text-xs font-semibold text-white"> Musique principale </span>
          </div>

          <span class="text-sm text-white"> {{ mainVolume }} % </span>
        </div>

        <input
          v-model.number="mainVolume"
          type="range"
          min="0"
          max="100"
          step="1"
          class="input-sound-range"
        />
      </div>

      <!-- Effets sonores -->
      <div class="rounded-lg bg-white/5 px-3 py-3">
        <label
          for="sound-effects-range"
          class="text-heading mb-2 flex items-center justify-between"
        >
          <span class="flex items-center gap-x-2">
            <WandSparklesIcon class="size-4 text-amber-300" />
            <span class="text-xs font-semibold text-gray-200"> Effets spéciaux </span>
          </span>

          <span class="text-sm text-white"> {{ effectsVolume }} % </span>
        </label>
        <input
          id="sound-effects-range"
          v-model.number="effectsVolume"
          type="range"
          min="0"
          max="100"
          step="1"
          class="input-sound-range"
        />
      </div>
    </div>
  </section>
</template>
