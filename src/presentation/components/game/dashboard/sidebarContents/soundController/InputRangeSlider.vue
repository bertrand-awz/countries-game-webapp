<script setup lang="ts">
  import { type Component, computed } from "vue";

  defineProps<{
    label: string;
    iconComponent: Component;
    iconColorClass: string;
  }>();

  const volume = defineModel<number>("volume", { required: true });

  const backgroundStyle = computed(() => {
    return `linear-gradient(to right, #8AFF95 ${volume.value}%, #ebe9e7 ${volume.value}%)`;
  });
</script>

<template>
  <div class="rounded-lg bg-white/5 p-3">
    <div class="mb-2 flex items-center justify-between">
      <div class="flex items-center gap-x-2">
        <component :is="iconComponent" class="size-4" :class="iconColorClass" />
        <span class="text-xs font-semibold text-white">{{ label }}</span>
      </div>
      <span class="text-sm text-white"> {{ volume }} % </span>
    </div>

    <input
      v-model.number="volume"
      type="range"
      min="0"
      max="100"
      step="1"
      :style="{ background: backgroundStyle }"
      class="input-sound-range w-full appearance-none"
    />
  </div>
</template>

<style scoped></style>
