<script setup lang="ts">
  import { ref } from "vue";
  import { useI18n } from "vue-i18n";

  import GameIconAndTitle from "./sidebarContents/GameIconAndTitle.vue";
  import ScoresDisplayer from "./sidebarContents/ScoresDisplayer.vue";
  import SoundControl from "./sidebarContents/SoundControl.vue";
  import GameSettings from "./sidebarContents/GameSettings.vue";

  const { t } = useI18n();

  const playersCount = ref(2);
  const timerMinutes = ref(5);
  let gameMode = "classic";

  defineProps<{
    navigation: {
      name: string;
      href: string;
      icon: unknown;
      current: boolean;
    }[];
    teams: {
      id: number;
      name: string;
      href: string;
      initial: string;
      current: boolean;
    }[];
  }>();
</script>

<template>
  <div class="flex h-full grow flex-col gap-y-10 overflow-y-auto px-6 pb-4 text-gray-400">
    <GameIconAndTitle :translate="t" />

    <nav class="flex flex-1 flex-col gap-8">
      <ScoresDisplayer />
      <SoundControl />

      <GameSettings
        v-model:players-count="playersCount"
        v-model:timer-minutes="timerMinutes"
        v-model:game-mode="gameMode"
      />
    </nav>
  </div>
</template>
