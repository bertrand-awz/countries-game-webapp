<script setup lang="ts">
  export type SelectOption = {
    label: string;
    value: string;
  };

  defineProps<{
    id: string;
    label: string;
    hint?: string;
    options: SelectOption[];
    disabled?: boolean;
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

    <select
      :id="id"
      v-model="model"
      :disabled="disabled"
      class="block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <option
        v-for="option in options"
        :key="option.value"
        class="bg-neutral-950"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
