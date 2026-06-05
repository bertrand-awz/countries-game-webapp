<script setup lang="ts">
  import { computed } from "vue";
  import { useI18n } from "vue-i18n";
  import { useRoute, useRouter } from "vue-router";

  import { RouteName } from "@/app/router/routeName.ts";
  import GameRoomCreationForm from "@/presentation/components/game/forms/GameRoomCreationForm.vue";
  import GameRoomJoiningForm from "@/presentation/components/game/forms/GameRoomJoiningForm.vue";

  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();

  const isPlayerJoiningRoom = computed(() => {
    return route.meta.joiningRoom === true;
  });

  function redirectToManualJoiningRoomForm(): void {
    router.push({
      name: RouteName.GAME_ROOM_MANUAL_JOINING,
    });
  }

  function redirectToCreateRoomForm(): void {
    router.push({
      name: RouteName.GAME_ROOM_CREATION,
    });
  }
</script>

<template>
  <div class="game-form-page">
    <GameRoomJoiningForm
      v-if="isPlayerJoiningRoom"
      :translator="t"
      :to-room-creation-redirection="redirectToCreateRoomForm"
    />

    <GameRoomCreationForm
      v-else
      :to-join-room-redirection="redirectToManualJoiningRoomForm"
      :translator="t"
    />
  </div>
</template>
