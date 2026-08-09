<script setup lang="ts">
  import { computed, onBeforeUnmount, ref } from "vue";
  import { useRoute } from "vue-router";

  import type { JoinRoomOptions } from "@/domain/game/ports/GameServer.ts";
  import BottomTextLink from "@/presentation/components/game/forms/BottomTextLink.vue";
  import LabeledTextInput from "@/presentation/components/partials/inputs/LabeledTextInput.vue";

  const props = defineProps<{
    toRoomCreationRedirection: () => void;
    translator: (translationKey: string) => string;
    onSubmitRoomJoiningForm: (joinRoomOptions: JoinRoomOptions) => Promise<void>;
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

  function submit(): void {
    const trimmedUsername = username.value.trim();
    const trimmedRoomId = roomId.value.trim();

    if (!trimmedUsername || !trimmedRoomId) {
      return;
    }
    props.onSubmitRoomJoiningForm({
      username: trimmedUsername,
      roomId: trimmedRoomId,
    });
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
          {{ translator("VIEWS.FORMS.GAME_ROOM_LOBBYING.ROOM_JOINING_TITLE") }}
        </h2>

        <p class="mt-2 text-sm text-gray-400">
          {{ translator("VIEWS.FORMS.GAME_ROOM_LOBBYING.SUBTITLES.JOIN_ROOM") }}
        </p>
      </div>

      <form class="mt-8 space-y-5" @submit.prevent="submit">
        <LabeledTextInput
          id="username"
          v-model="username"
          :label="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_LABELS.USERNAME')"
          :hint="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.USERNAME')"
          :placeholder="
            translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.USERNAME_PLACEHOLDER')
          "
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
          {{ translator("VIEWS.FORMS.GAME_ROOM_LOBBYING.BUTTONS.JOIN_ROOM") }}
        </button>
      </form>
      <BottomTextLink
        :main-text="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.BOTTOM_TEXTS.CREATE_ROOM_QUESTION')"
        :link-text="
          translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.BOTTOM_TEXTS.CREATE_ROOM_LINK_LABEL')
        "
        :on-link-click="toRoomCreationRedirection"
      />
    </section>
  </div>
</template>
