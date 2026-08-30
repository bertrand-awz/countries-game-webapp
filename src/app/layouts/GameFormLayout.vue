<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import { useRoute, useRouter } from "vue-router";

  import { RouteName } from "@/app/router/routeName.ts";
  import { createRoomUseCase, joinRoomUseCase } from "@/application/use-cases";
  import type { CreateRoomOptions, JoinRoomOptions } from "@/domain/game/ports/GameServer.ts";
  import GameRoomCreationForm from "@/presentation/components/game/forms/GameRoomCreationForm.vue";
  import GameRoomJoiningForm from "@/presentation/components/game/forms/GameRoomJoiningForm.vue";

  type ConnectionError = {
    message: string;
    advice?: string;
  };

  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();
  const isConnecting = ref(false);
  const connectionError = ref<ConnectionError | null>(null);

  const isPlayerJoiningRoom = computed(() => {
    return route.meta.joiningRoom === true;
  });

  const connectionErrorMessage = computed(() => {
    return connectionError.value?.message ?? null;
  });

  const joiningSubmissionErrorAdvice = computed(() => {
    return (
      connectionError.value?.advice ??
      t("VIEWS.FORMS.GAME_ROOM_LOBBYING.ERRORS.JOIN_CREATE_ROOM_ADVICE")
    );
  });

  function redirectToManualJoiningRoomForm(): void {
    connectionError.value = null;
    router.push({
      name: RouteName.GAME_ROOM_MANUAL_JOINING,
    });
  }

  function redirectToCreateRoomForm(): void {
    connectionError.value = null;
    router.push({
      name: RouteName.GAME_ROOM_CREATION,
    });
  }

  function clearConnectionError(): void {
    connectionError.value = null;
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
      connectionError.value = getConnectionError(error);
    } finally {
      isConnecting.value = false;
    }
  }

  function getConnectionError(error: unknown): ConnectionError {
    if (!(error instanceof Error)) {
      return {
        message: t("VIEWS.FORMS.GAME_ROOM_LOBBYING.ERRORS.UNABLE_TO_CONNECT"),
      };
    }

    const message = error.message.toLowerCase();

    if (message.includes("locked")) {
      return {
        message: t("VIEWS.FORMS.GAME_ROOM_LOBBYING.ERRORS.ROOM_LOCKED"),
        advice: t("VIEWS.FORMS.GAME_ROOM_LOBBYING.ERRORS.ROOM_LOCKED_JOIN_ADVICE"),
      };
    }

    if (message.includes("room_full") || message.includes("full")) {
      return {
        message: t("VIEWS.FORMS.GAME_ROOM_LOBBYING.ERRORS.ROOM_FULL"),
        advice: t("VIEWS.FORMS.GAME_ROOM_LOBBYING.ERRORS.ROOM_LOCKED_JOIN_ADVICE"),
      };
    }

    return {
      message: error.message || t("VIEWS.FORMS.GAME_ROOM_LOBBYING.ERRORS.UNABLE_TO_CONNECT"),
    };
  }

  function submitRoomCreationForm(roomCreationOptions: CreateRoomOptions): Promise<void> {
    return connectAndRedirect(() => createRoomUseCase.setOptions(roomCreationOptions).execute());
  }

  function submitJoiningRoomForm(joinRoomOptions: JoinRoomOptions): Promise<void> {
    return connectAndRedirect(() => joinRoomUseCase.setOptions(joinRoomOptions).execute());
  }
</script>

<template>
  <div class="game-form-page">
    <GameRoomJoiningForm
      v-if="isPlayerJoiningRoom"
      :translator="t"
      :to-room-creation-redirection="redirectToCreateRoomForm"
      :on-submit-room-joining-form="submitJoiningRoomForm"
      :is-submitting="isConnecting"
      :submission-error="connectionErrorMessage"
      :submission-error-advice="joiningSubmissionErrorAdvice"
      :clear-submission-error="clearConnectionError"
    />

    <GameRoomCreationForm
      v-else
      :to-join-room-redirection="redirectToManualJoiningRoomForm"
      :translator="t"
      :on-submit-room-creation-form-callback="submitRoomCreationForm"
      :is-submitting="isConnecting"
      :submission-error="connectionErrorMessage"
      :clear-submission-error="clearConnectionError"
    />
  </div>
</template>
