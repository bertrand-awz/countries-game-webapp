<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";

  import DefaultLayout from "@/app/layouts/DefaultLayout.vue";
  import GameDashboardLayout from "@/app/layouts/GameDashboardLayout.vue";
  import GameFormLayout from "@/app/layouts/GameFormLayout.vue";
  import LoadingLayout from "@/app/layouts/LoadingLayout.vue";
  import { layoutTypes } from "@/app/layouts/types/layoutTypes";

  const route = useRoute();

  const layout = computed(() => {
    if (route.meta.layout === layoutTypes.GAME) {
      return GameDashboardLayout;
    } else if (route.meta.layout === layoutTypes.GAME_FORM) {
      return GameFormLayout;
    }

    return DefaultLayout;
  });
</script>

<template>
  <Suspense :timeout="0">
    <template #default>
      <component :is="layout" />
    </template>

    <template #fallback>
      <LoadingLayout />
    </template>
  </Suspense>
</template>
