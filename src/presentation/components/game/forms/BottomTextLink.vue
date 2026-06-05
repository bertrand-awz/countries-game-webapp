<script setup lang="ts">
  import LinkButton from "@/presentation/components/partials/buttons/LinkButton.vue";
  defineProps<{
    mainText?: string;
    linkText: string;
    onLinkClick: () => void;
  }>();
</script>

<template>
  <div class="mt-6 flex-row items-center justify-center text-center text-sm text-gray-400">
    <p>{{ mainText }}</p>
    <LinkButton :link-label="linkText" :on-click-callback="onLinkClick" />
  </div>
</template>
