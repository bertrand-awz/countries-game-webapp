<script setup lang="ts">
  import { computed, onBeforeUnmount, ref } from "vue";
  import { useRoute } from "vue-router";

  import BottomTextLink from "@/presentation/components/game/forms/BottomTextLink.vue";
  import LabeledTextInput from "@/presentation/components/partials/inputs/LabeledTextInput.vue";

  defineProps<{
    toRoomCreationRedirection: () => void;
    translator: (translationKey: string) => string;
  }>();

  const route = useRoute();

  const username = ref("");
  const manualRoomId = ref("");

  const isManualRoomIdInputAllowed = computed(() => {
    return route.meta.manualRoomIdInputAllowed === true;
  });

  const routeRoomId = computed(() => {
    const param = route.params.roomId;
    return typeof param === "string" ? param : "";
  });

  const roomId = computed({
    get() {
      return isManualRoomIdInputAllowed.value ? manualRoomId.value : routeRoomId.value;
    },
    set(value: string) {
      manualRoomId.value = value;
    },
  });

  function joinRoom(): void {
    const trimmedUsername = username.value.trim();
    const trimmedRoomId = roomId.value.trim();

    if (!trimmedUsername || !trimmedRoomId) {
      return;
    }

    // joinRoomUseCase.setOptions({
    //   username: trimmedUsername,
    //   roomId: trimmedRoomId,
    // }).execute();
  }

  onBeforeUnmount(() => {
    sessionStorage.removeItem("manual-room-joining-allowed");
  });
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <section
      class="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-neutral-950 p-6 text-white shadow-2xl"
    >
      <div class="text-center">
        <h2 class="text-2xl font-bold tracking-tight">
          {{ translator("VIEWS.FORMS.GAME_ROOM_LOBBYING.CHOICES.JOIN_ROOM") }}
        </h2>

        <p class="mt-2 text-sm text-gray-400">Entrez vos informations pour rejoindre la partie.</p>
      </div>

      <form class="mt-8 space-y-5" @submit.prevent="joinRoom">
        <LabeledTextInput
          id="username"
          v-model="username"
          :label="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_LABELS.USERNAME')"
          :hint="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.USERNAME')"
          placeholder="Bertrand"
          autocomplete="off"
        />

        <LabeledTextInput
          v-if="isManualRoomIdInputAllowed"
          id="room-id"
          v-model="roomId"
          label="Room ID"
          :hint="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.ROOM_ID')"
          placeholder="ABC123"
          autocomplete="off"
        />

        <div v-else class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
          <p class="text-xs text-gray-500">Room ID</p>
          <p class="mt-1 text-sm font-semibold text-white">
            {{ routeRoomId }}
          </p>
        </div>

        <button
          type="submit"
          class="flex w-full justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          {{ translator("VIEWS.FORMS.GAME_ROOM_LOBBYING.CHOICES.JOIN_ROOM") }}
        </button>
      </form>
      <BottomTextLink
        main-text="Create room?"
        link-text="create create room"
        :on-link-click="toRoomCreationRedirection"
      />
    </section>
  </div>
</template>
