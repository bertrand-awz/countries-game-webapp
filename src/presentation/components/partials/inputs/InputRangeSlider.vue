<script setup lang="ts">
  import { type Component, computed } from "vue";

  const props = withDefaults(
    defineProps<{
      label?: string;
      labelClass?: string;
      iconComponent?: Component | null;
      iconColorClass?: string;
      minimum?: number;
      maximum?: number;
      unit?: string;
      disabled?: boolean;
    }>(),
    {
      label: "",
      labelClass: "",
      iconComponent: null,
      iconColorClass: "",
      minimum: 0,
      maximum: 100,
      unit: "",
      disabled: false,
    },
  );

  const inputValue = defineModel<number>("inputValue", { required: true });

  const inputPercentage = computed(() => {
    const range = props.maximum - props.minimum;

    if (range <= 0) {
      return 0;
    }

    const percentage = ((inputValue.value - props.minimum) / range) * 100;

    return Math.min(100, Math.max(0, percentage));
  });

  const backgroundStyle = computed(() => {
    return `linear-gradient(to right, #8AFF95 ${inputPercentage.value}%, #ebe9e7 ${inputPercentage.value}%)`;
  });
</script>

<template>
  <div class="rounded-lg bg-white/5 p-3">
    <div class="mb-2 flex items-center justify-between">
      <div v-if="iconComponent" class="flex items-center gap-x-2">
        <component :is="iconComponent" class="size-4" :class="iconColorClass" />
        <span :class="labelClass ? labelClass : 'text-xs font-semibold text-white'">{{
          label
        }}</span>
      </div>
      <span class="text-sm text-white"> {{ inputValue }} {{ unit }} </span>
    </div>

    <input
      v-model.number="inputValue"
      type="range"
      :min="minimum"
      :max="maximum"
      step="1"
      :disabled="disabled"
      :style="{ background: backgroundStyle }"
      class="input-sound-range w-full appearance-none disabled:cursor-not-allowed disabled:opacity-50"
    />
  </div>
</template>

<style scoped></style>
