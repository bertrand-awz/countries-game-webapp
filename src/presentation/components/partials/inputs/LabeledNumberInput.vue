<script setup lang="ts">
  defineProps<{
    id: string;
    label: string;
    hint?: string;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    error?: string | null;
  }>();

  const model = defineModel<number>({
    default: 0,
  });
</script>

<template>
  <div>
    <div class="mb-2 flex items-center gap-x-2">
      <label :for="id" class="text-sm font-medium text-gray-100">
        {{ label }}
      </label>

      <span
        v-if="hint"
        class="inline-flex size-5 items-center justify-center rounded-full border border-white/20 text-xs font-bold text-gray-400"
        :title="hint"
      >
        ?
      </span>
    </div>

    <input
      :id="id"
      v-model.number="model"
      type="number"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? `${id}-error` : undefined"
      class="block w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
      :class="error ? 'border-red-400/70 focus:border-red-300' : 'border-white/10 focus:border-emerald-400'"
    />

    <p v-if="error" :id="`${id}-error`" class="mt-2 text-xs text-red-300">
      {{ error }}
    </p>
  </div>
</template>
