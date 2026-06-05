<script setup lang="ts">
  defineProps<{
    id: string;
    label: string;
    hint?: string;
    description?: string;
    disabled?: boolean;
  }>();

  const model = defineModel<boolean>({
    default: false,
  });
</script>

<template>
  <div class="rounded-lg border border-white/10 bg-white/5 p-3">
    <div class="flex items-center justify-between gap-x-4">
      <div>
        <div class="flex items-center gap-x-2">
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

        <p v-if="description" class="mt-1 text-xs text-gray-500">
          {{ description }}
        </p>
      </div>

      <input
        :id="id"
        v-model="model"
        type="checkbox"
        :disabled="disabled"
        class="size-4 rounded border-white/20 bg-white/5 accent-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  </div>
</template>
