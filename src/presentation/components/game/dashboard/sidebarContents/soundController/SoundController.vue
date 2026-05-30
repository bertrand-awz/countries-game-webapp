<script setup lang="ts">
  import { MusicIcon, Volume2Icon, WandSparklesIcon } from "@lucide/vue";
  import InputRangeSlider from "./InputRangeSlider.vue";

  defineProps<{
    translator: (translationKey: string) => string;
  }>();

  const mainVolume = defineModel<number>("mainVolume", {
    default: 50,
  });

  const effectsVolume = defineModel<number>("effectsVolume", {
    default: 50,
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
        :label="translator('GAME.SIDEBAR.SOUND_CONTROLLER.BACKGROUND_SOUND')"
        :icon-component="MusicIcon"
        icon-color-class="text-sky-300"
        :volume="mainVolume"
      />
      <InputRangeSlider
        :label="translator('GAME.SIDEBAR.SOUND_CONTROLLER.SOUND_EFFECTS')"
        :icon-component="WandSparklesIcon"
        icon-color-class="text-yellow-300"
        :volume="effectsVolume"
      />
    </div>
  </section>
</template>
