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
      class="inline-flex cursor-pointer items-center gap-x-2 pt-2 pr-3 pb-2 pl-3 text-emerald-400 hover:text-emerald-300"
      @click="onClickCallback"
    >
      <span class="leading-none">{{ linkLabel }}</span>
      <ExternalLinkIcon :size="16" class="shrink-0 translate-y-[-1.5px]" />
    </button>
  </div>
</template>
