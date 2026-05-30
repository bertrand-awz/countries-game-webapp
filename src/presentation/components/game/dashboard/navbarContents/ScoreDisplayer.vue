<script setup lang="ts">
  const score = defineModel<number>("score", { required: true });
</script>

<template>
  <div class="navbar-score-displayer">
    {{ score }}
  </div>
</template>
