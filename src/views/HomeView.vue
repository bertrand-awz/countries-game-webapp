<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <section class="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-6 text-center">
    <h1 class="text-5xl font-bold text-emerald-400">
      {{ t("home.title") }}
    </h1>

    <p class="mt-4 max-w-2xl text-lg text-slate-300">
      {{ t("home.description") }}
    </p>

    <RouterLink
      to="/game"
      class="mt-8 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-400"
    >
      {{ t("home.start") }}
    </RouterLink>
  </section>
</template>