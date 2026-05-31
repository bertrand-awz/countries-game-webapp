<script setup lang="ts">
  import { Gamepad2Icon, SettingsIcon, TimerIcon, UsersIcon, XIcon } from "@lucide/vue";
  import { ref } from "vue";

  type GameMode = "classic" | "timer" | "versus";

  const isSettingsOpen = ref(false);

  const playersCount = defineModel<number>("playersCount", {
    default: 2,
  });

  const timerMinutes = defineModel<number>("timerMinutes", {
    default: 5,
  });

  const gameMode = defineModel<GameMode>("gameMode", {
    default: "classic",
  });

  const gameModes: { label: string; value: GameMode }[] = [
    { label: "Classique", value: "classic" },
    { label: "Chronomètre", value: "timer" },
    { label: "Contre un adversaire", value: "versus" },
  ];

  function openSettings() {
    isSettingsOpen.value = true;
  }

  function closeSettings() {
    isSettingsOpen.value = false;
  }
</script>

<template>
  <div class="mt-auto">
    <button
      type="button"
      class="flex w-full items-center gap-x-2 rounded-lg px-2 py-2 text-sm font-semibold text-gray-200 transition hover:bg-white/5 hover:text-white"
      @click="openSettings"
    >
      <SettingsIcon class="size-5 text-gray-400" />
      <span>Settings</span>
    </button>
  </div>

  <Teleport to="body">
    <div v-if="isSettingsOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeSettings" />

      <!-- Modal -->
      <section
        class="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-5 text-white shadow-2xl"
      >
        <!-- Header -->
        <div class="mb-5 flex items-center justify-between">
          <div class="flex items-center gap-x-2">
            <SettingsIcon class="size-5 text-indigo-400" />

            <h2 class="text-lg font-bold">Paramètres de la partie</h2>
          </div>

          <button
            type="button"
            class="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
            @click="closeSettings"
          >
            <XIcon class="size-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="space-y-4">
          <!-- Nombre de joueurs -->
          <label class="block rounded-xl bg-white/5 px-4 py-3">
            <div class="mb-3 flex items-center justify-between">
              <div class="flex items-center gap-x-2">
                <UsersIcon class="size-4 text-emerald-300" />

                <span class="text-sm font-medium text-gray-200"> Nombre de joueurs </span>
              </div>

              <span class="text-sm font-bold text-white">
                {{ playersCount }}
              </span>
            </div>

            <input
              v-model.number="playersCount"
              type="range"
              min="1"
              max="8"
              step="1"
              class="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-indigo-400"
            />
          </label>

          <!-- TimeDisplayer -->
          <label class="block rounded-xl bg-white/5 px-4 py-3">
            <div class="mb-3 flex items-center justify-between">
              <div class="flex items-center gap-x-2">
                <TimerIcon class="size-4 text-amber-300" />

                <span class="text-sm font-medium text-gray-200"> Durée du timer </span>
              </div>

              <span class="text-sm font-bold text-white"> {{ timerMinutes }} min </span>
            </div>

            <input
              v-model.number="timerMinutes"
              type="range"
              min="1"
              max="30"
              step="1"
              class="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-indigo-400"
            />
          </label>

          <!-- Mode de jeu -->
          <label class="block rounded-xl bg-white/5 px-4 py-3">
            <div class="mb-3 flex items-center gap-x-2">
              <Gamepad2Icon class="size-4 text-sky-300" />

              <span class="text-sm font-medium text-gray-200"> Mode de jeu </span>
            </div>

            <select
              v-model="gameMode"
              class="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white transition outline-none focus:border-indigo-400"
            >
              <option
                v-for="mode in gameModes"
                :key="mode.value"
                :value="mode.value"
                class="bg-slate-900 text-white"
              >
                {{ mode.label }}
              </option>
            </select>
          </label>
        </div>

        <!-- Footer -->
        <div class="mt-5 flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            @click="closeSettings"
          >
            Appliquer
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
