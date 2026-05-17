<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <main class="min-h-screen bg-slate-950 text-white">
    <nav class="flex items-center justify-between border-b border-slate-800 px-6 py-4">
      <RouterLink to="/" class="text-xl font-bold text-emerald-400">
        Naming Countries Game
      </RouterLink>

      <div class="flex gap-4">
        <RouterLink to="/" class="text-slate-300 hover:text-white">
          Accueil
        </RouterLink>

        <RouterLink to="/game" class="text-slate-300 hover:text-white">
          Jouer
        </RouterLink>
      </div>
    </nav>

    <RouterView />
  </main>
</template>