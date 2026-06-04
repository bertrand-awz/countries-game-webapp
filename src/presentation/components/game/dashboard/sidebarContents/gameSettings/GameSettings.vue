<script setup lang="ts">
  import { SettingsIcon, TimerIcon, UsersRoundIcon, XIcon } from "@lucide/vue";
  import { ref } from "vue";

  import { GameConstraints } from "@/domain/game/constraints/gameConstraints.ts";
  import type { GameSetting } from "@/domain/game/settings";
  import InputRangeSlider from "@/presentation/components/common/InputRangeSlider.vue";

  const props = defineProps<{
    translator: (translationKey: string) => string;
    applySettingCallback: (newSettings: GameSetting) => void;
  }>();
  const isSettingsOpen = ref(false);

  const playersCount = defineModel<number>("playersCount", {
    default: GameConstraints.MIN_MAX_ALLOWED_PLAYERS.min,
  });

  const timerMinutes = defineModel<number>("timerMinutes", {
    default: GameConstraints.TIME_MIN_MAX_MINUTES.min,
  });

  function openSettingsModal() {
    isSettingsOpen.value = true;
  }

  function closeSettingsModal() {
    isSettingsOpen.value = false;
  }

  function applySettings() {
    const newSettings = { numPlayers: playersCount.value, durationInMinutes: timerMinutes.value };
    props.applySettingCallback(newSettings);
    closeSettingsModal();
  }
</script>

<template>
  <div class="mt-auto">
    <button
      type="button"
      class="flex w-full items-center gap-x-2 rounded-lg px-2 py-2 text-sm font-semibold text-gray-200 transition hover:bg-white/5 hover:text-white"
      @click="openSettingsModal"
    >
      <SettingsIcon class="size-5 text-gray-400" />
      <span>{{ translator("GAME.SIDEBAR.SETTINGS.TITLE") }}</span>
    </button>
  </div>

  <Teleport to="body">
    <div
      v-if="isSettingsOpen"
      class="font-mono-app fixed inset-0 z-50 flex items-center justify-center px-4 text-white"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeSettingsModal" />

      <!-- Modal -->
      <section class="modal relative z-10">
        <div class="mb-5 flex items-center justify-between">
          <div class="flex items-center gap-x-2">
            <SettingsIcon class="size-5 text-gray-500" />
            <h2 class="text-lg font-bold">{{ translator("GAME.SIDEBAR.SETTINGS.TITLE") }}</h2>
          </div>

          <button
            type="button"
            class="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
            @click="closeSettingsModal"
          >
            <XIcon class="size-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="space-y-4">
          <InputRangeSlider
            v-model:input-value="playersCount"
            :label="translator('GAME.SIDEBAR.SETTINGS.MODAL.MAX_PLAYERS_ALLOWED')"
            label-class="text-sm font-normal"
            :icon-component="UsersRoundIcon"
            :icon-color-class="'size-4 text-emerald-300'"
            :minimum="GameConstraints.MIN_MAX_ALLOWED_PLAYERS.min"
            :maximum="GameConstraints.MIN_MAX_ALLOWED_PLAYERS.max"
            unit=""
          />

          <InputRangeSlider
            v-model:input-value="timerMinutes"
            :label="translator('GAME.SIDEBAR.SETTINGS.MODAL.GAME_DURATION')"
            label-class="text-sm font-normal"
            :icon-component="TimerIcon"
            :icon-color-class="'size-4 text-emerald-300'"
            :minimum="GameConstraints.TIME_MIN_MAX_MINUTES.min"
            :maximum="GameConstraints.TIME_MIN_MAX_MINUTES.max"
            :unit="translator('GAME.SIDEBAR.SETTINGS.MODAL.GAME_DURATION_UNIT')"
          />
        </div>

        <!-- Footer -->
        <div class="mt-5 flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            @click="applySettings"
          >
            {{ translator("GAME.SIDEBAR.SETTINGS.MODAL.BUTTON_APPLY") }}
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
