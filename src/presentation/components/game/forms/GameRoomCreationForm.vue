<script setup lang="ts">
  import { computed, ref } from "vue";

  import BottomTextLink from "@/presentation/components/game/forms/BottomTextLink.vue";
  import LabeledCheckboxInput from "@/presentation/components/partials/inputs/LabeledCheckboxInput.vue";
  import LabeledNumberInput from "@/presentation/components/partials/inputs/LabeledNumberInput.vue";
  import LabeledSelectionInput, {
    type SelectOption,
  } from "@/presentation/components/partials/inputs/LabeledSelectionInput.vue";
  import LabeledTextInput from "@/presentation/components/partials/inputs/LabeledTextInput.vue";

  const props = defineProps<{
    toJoinRoomRedirection: () => void;
    translator: (translationKey: string) => string;
  }>();

  const username = ref("");
  const gameLanguage = ref("fr");
  const maxPlayers = ref(4);
  const gameDuration = ref(3);
  const freedomOfLanguage = ref(true);

  const languageOptions = computed<SelectOption[]>(() => [
    {
      label: props.translator("LANGUAGES.FR"),
      value: "fr",
    },
    {
      label: props.translator("LANGUAGES.EN"),
      value: "en",
    },
  ]);

  function createRoom(): void {
    const trimmedUsername = username.value.trim();

    if (!trimmedUsername) {
      return;
    }

    // createRoomUseCase.setOptions({
    //   username: trimmedUsername,
    //   gameLanguage: gameLanguage.value,
    //   maxPlayersAllowed: maxPlayers.value,
    //   gameDurationInMinutes: gameDuration.value,
    //   freedomOfLanguage: freedomOfLanguage.value,
    // }).execute();
  }
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <section
      class="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-neutral-950 p-6 text-white shadow-2xl"
    >
      <div class="text-center">
        <h2 class="text-2xl font-bold tracking-tight">
          {{ translator("VIEWS.FORMS.GAME_ROOM_LOBBYING.ROOM_CREATION_TITLE") }}
        </h2>

        <p class="mt-2 text-sm text-gray-400">
          {{ translator("VIEWS.FORMS.GAME_ROOM_LOBBYING.SUBTITLES.CREATE_ROOM") }}
        </p>
      </div>

      <form class="mt-8 space-y-5" @submit.prevent="createRoom">
        <LabeledTextInput
          id="username"
          v-model="username"
          :label="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_LABELS.USERNAME')"
          :hint="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.USERNAME')"
          placeholder="Bertrand"
          autocomplete="off"
        />

        <LabeledSelectionInput
          id="game-language"
          v-model="gameLanguage"
          :label="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_LABELS.GAME_LANGUAGE')"
          :hint="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.GAME_LANGUAGE')"
          :options="languageOptions"
        />

        <LabeledNumberInput
          id="max-players"
          v-model="maxPlayers"
          :label="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_LABELS.MAX_PLAYER')"
          :hint="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.MAX_PLAYER')"
          :min="2"
          :max="8"
        />

        <LabeledNumberInput
          id="game-duration"
          v-model="gameDuration"
          :label="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_LABELS.GAME_DURATION')"
          :hint="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.GAME_DURATION')"
          :min="1"
          :max="10"
        />

        <LabeledCheckboxInput
          id="freedom-of-language"
          v-model="freedomOfLanguage"
          :label="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_LABELS.FREEDOM_OF_LANGUAGE')"
          :hint="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.FREEDOM_OF_LANGUAGE')"
          :description="
            translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.FREEDOM_OF_LANGUAGE')
          "
        />

        <button
          type="submit"
          class="flex w-full justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          {{ translator("VIEWS.FORMS.GAME_ROOM_LOBBYING.BUTTONS.CREATE_ROOM") }}
        </button>
      </form>

      <BottomTextLink
        :main-text="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.BOTTOM_TEXTS.JOIN_ROOM_QUESTION')"
        :link-text="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.BOTTOM_TEXTS.JOIN_ROOM_LINK_LABEL')"
        :on-link-click="toJoinRoomRedirection"
      />
    </section>
  </div>
</template>
