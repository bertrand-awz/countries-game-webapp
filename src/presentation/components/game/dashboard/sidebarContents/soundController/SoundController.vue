<script setup lang="ts">
  import { MusicIcon, Volume2Icon, WandSparklesIcon } from "@lucide/vue";
  import InputRangeSlider from "./InputRangeSlider.vue";
  import type { SoundManager } from "@/domain/game/ports/SoundManager.ts";
  import { ref, watch } from "vue";

  const props = defineProps<{
    translator: (translationKey: string) => string;
    soundManager: SoundManager;
  }>();

  const mainVolume = ref(props.soundManager.getMainVolume());

  const effectsVolume = ref(props.soundManager.getSoundEffectVolume());

  watch(mainVolume, (value: number) => {
    props.soundManager.setMainThemeVolume(value);
  });

  watch(effectsVolume, (value: number) => {
    props.soundManager.setSoundEffectVolume(value);
  });
</script>

<template>
  <section class="space-y-4">
    <div class="text-md/6 flex items-center gap-x-2 font-semibold">
      <Volume2Icon class="sidebar-section-icon" />
      <h2 class="sidebar-section-title">
        {{ translator("GAME.SIDEBAR.SOUND_CONTROLLER.TITLE") }}
      </h2>
    </div>

    <div class="ml-2 space-y-4 border-l border-white/10 pl-4">
      <InputRangeSlider
        v-model:volume="mainVolume"
        :label="translator('GAME.SIDEBAR.SOUND_CONTROLLER.BACKGROUND_SOUND')"
        :icon-component="MusicIcon"
        icon-color-class="text-sky-300"
      />

      <InputRangeSlider
        v-model:volume="effectsVolume"
        :label="translator('GAME.SIDEBAR.SOUND_CONTROLLER.SOUND_EFFECTS')"
        :icon-component="WandSparklesIcon"
        icon-color-class="text-yellow-300"
      />
    </div>
  </section>
</template>
