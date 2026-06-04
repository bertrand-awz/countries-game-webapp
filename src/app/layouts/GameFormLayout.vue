<script setup lang="ts">
  import GameRoomJoiningForm from "@/presentation/components/game/forms/GameRoomJoiningForm.vue";
  import GameRoomLobbyingForm from "@/presentation/components/game/forms/GameRoomLobbyingForm.vue";

  defineProps<{
    isJoiningRoom: boolean;
  }>();
</script>

<template>
  <div class="game-form-page">
    <GameRoomJoiningForm v-if="isJoiningRoom" />
    <GameRoomLobbyingForm v-else />
  </div>
</template>
