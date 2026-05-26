<script setup lang="ts">
  const props = defineProps<{
    score: number;
  }>();
</script>

<template>
  <div class="navbar-score-displayer">
    {{ props.score }}
  </div>
</template>
