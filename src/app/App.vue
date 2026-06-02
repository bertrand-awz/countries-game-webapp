<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";

  import DefaultLayout from "@/app/layouts/DefaultLayout.vue";
  import GameDashboardLayout from "@/app/layouts/GameDashboardLayout.vue";
  import { layoutTypes } from "@/app/layouts/types/layoutTypes";

  const route = useRoute();

  const layout = computed(() => {
    if (route.meta.layout === layoutTypes.GAME) {
      return GameDashboardLayout;
    }

    return DefaultLayout;
  });
</script>

<template>
  <component :is="layout" />
</template>
