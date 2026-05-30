<script setup lang="ts">
  import { ref } from "vue";
  import { useI18n } from "vue-i18n";

  import GameIconAndTitle from "./sidebarContents/GameIconAndTitle.vue";
  import SoundController from "./sidebarContents/soundController/SoundController.vue";
  import GameSettings from "./sidebarContents/gameSettings/GameSettings.vue";

  const { t } = useI18n();

  const playersCount = ref(2);
  const timerMinutes = ref(5);
</script>

<template>
  <div class="sidebar-content">
    <GameIconAndTitle :translate="t" />

    <nav class="flex flex-1 flex-col gap-8">
      <SoundController :translator="t" />

      <GameSettings v-model:players-count="playersCount" v-model:timer-minutes="timerMinutes" />
    </nav>
  </div>
</template>
