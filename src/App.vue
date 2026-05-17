<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";

  import DefaultLayout from "./layouts/DefaultLayout.vue";
  import GameLayout from "./layouts/GameLayout.vue";
  import {layoutTypes } from "./layouts/types/layoutTypes";

  const route = useRoute();
  const layout = computed(() => {
    if (route.meta.layout === layoutTypes.GAME) {
      return GameLayout;
    }
    return DefaultLayout;
  });
</script>

<template>
  <component :is="layout" />
</template>
