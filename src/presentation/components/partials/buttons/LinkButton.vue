<script setup lang="ts">
  import { ExternalLinkIcon } from "@lucide/vue";
  defineProps<{
    linkLabel: string;
    onClickCallback: () => void;
  }>();
</script>

<template>
  <div class="flex items-center justify-center">
    <button
      id="link-button"
      type="button"
      class="inline-flex items-center gap-x-2 pt-2 pb-2 text-emerald-400 hover:text-emerald-300"
      @click="onClickCallback"
    >
      <span class="leading-none">{{ linkLabel }}</span>
      <ExternalLinkIcon :size="16" class="shrink-0 -translate-y-0.5" />
    </button>
  </div>
</template>
