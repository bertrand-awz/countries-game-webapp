<script setup lang="ts">
  import { computed } from "vue";
  import { useI18n } from "vue-i18n";
  import { useRoute, useRouter } from "vue-router";

  import { RouteName } from "@/app/router/routeName.ts";
  import { createRoomUseCase, joinRoomUseCase } from "@/application/use-cases";
  import type { CreateRoomOptions, JoinRoomOptions } from "@/domain/game/ports/GameServer.ts";
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

  function submitRoomCreationForm(roomCreationOptions: CreateRoomOptions): void {
    createRoomUseCase.setOptions(roomCreationOptions).execute();
    router.push({
      name: RouteName.GAME,
    });
  }

  function submitJoiningRoomForm(joinRoomOptions: JoinRoomOptions): void {
    joinRoomUseCase.setOptions(joinRoomOptions).execute();
    router.push({
      name: RouteName.GAME,
    });
  }
</script>

<template>
  <div class="game-form-page">
    <GameRoomJoiningForm
      v-if="isPlayerJoiningRoom"
      :translator="t"
      :to-room-creation-redirection="redirectToCreateRoomForm"
      :on-submit-room-joining-form="submitJoiningRoomForm"
    />

    <GameRoomCreationForm
      v-else
      :to-join-room-redirection="redirectToManualJoiningRoomForm"
      :translator="t"
      :on-submit-room-creation-form-callback="submitRoomCreationForm"
    />
  </div>
</template>
