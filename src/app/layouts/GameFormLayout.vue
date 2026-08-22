<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import { useRoute, useRouter } from "vue-router";

  import LoadingLayout from "@/app/layouts/LoadingLayout.vue";
  import { RouteName } from "@/app/router/routeName.ts";
  import { createRoomUseCase, joinRoomUseCase } from "@/application/use-cases";
  import type { CreateRoomOptions, JoinRoomOptions } from "@/domain/game/ports/GameServer.ts";
  import GameRoomCreationForm from "@/presentation/components/game/forms/GameRoomCreationForm.vue";
  import GameRoomJoiningForm from "@/presentation/components/game/forms/GameRoomJoiningForm.vue";

  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();
  const isConnecting = ref(false);
  const connectionError = ref<string | null>(null);

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

  async function connectAndRedirect(connectToRoom: () => Promise<unknown>): Promise<void> {
    if (isConnecting.value) {
      return;
    }

    isConnecting.value = true;
    connectionError.value = null;

    try {
      await connectToRoom();
      await router.push({
        name: RouteName.GAME,
      });
    } catch (error) {
      connectionError.value = getConnectionErrorMessage(error);
    } finally {
      isConnecting.value = false;
    }
  }

  function getConnectionErrorMessage(error: unknown): string {
    if (!(error instanceof Error)) {
      return t("VIEWS.FORMS.GAME_ROOM_LOBBYING.ERRORS.UNABLE_TO_CONNECT");
    }

    const message = error.message.toLowerCase();

    if (message.includes("room_full") || message.includes("full")) {
      return t("VIEWS.FORMS.GAME_ROOM_LOBBYING.ERRORS.ROOM_FULL");
    }

    return error.message || t("VIEWS.FORMS.GAME_ROOM_LOBBYING.ERRORS.UNABLE_TO_CONNECT");
  }

  function submitRoomCreationForm(roomCreationOptions: CreateRoomOptions): Promise<void> {
    return connectAndRedirect(() => createRoomUseCase.setOptions(roomCreationOptions).execute());
  }

  function submitJoiningRoomForm(joinRoomOptions: JoinRoomOptions): Promise<void> {
    return connectAndRedirect(() => joinRoomUseCase.setOptions(joinRoomOptions).execute());
  }
</script>

<template>
  <LoadingLayout v-if="isConnecting" />

  <div v-else class="game-form-page">
    <p
      v-if="connectionError"
      role="alert"
      class="fixed top-6 right-6 left-6 rounded-lg border border-red-500/40 bg-red-950/80 px-4 py-3 text-center text-sm text-red-100"
    >
      {{ connectionError }}
    </p>

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
