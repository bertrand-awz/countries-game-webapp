<script setup lang="ts">
  defineProps<{
    id: string;
    label: string;
    hint?: string;
    placeholder?: string;
    disabled?: boolean;
    autocomplete?: string;
    error?: string | null;
  }>();

  const model = defineModel<string>({
    default: "",
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
      v-model="model"
      type="text"
      :autocomplete="autocomplete ?? 'off'"
      :disabled="disabled"
      :placeholder="placeholder"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? `${id}-error` : undefined"
      class="block w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
      :class="
        error
          ? 'border-red-400/70 focus:border-red-300'
          : 'border-white/10 focus:border-emerald-400'
      "
    />

    <p v-if="error" :id="`${id}-error`" class="mt-2 text-xs text-red-300">
      {{ error }}
    </p>
  </div>
</template>
