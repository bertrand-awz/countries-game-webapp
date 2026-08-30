<script setup lang="ts">
  import { computed, ref, watch } from "vue";

  import { GameConstraints } from "@/domain/game/constraints/gameConstraints.ts";
  import type { CreateRoomOptions } from "@/domain/game/ports/GameServer.ts";
  import {
    isSupportedLanguage,
    SUPPORTED_ANSWER_VALIDATION_LANGUAGES,
  } from "@/domain/shared/models/SupportedLanguage.ts";
  import BottomTextLink from "@/presentation/components/game/forms/BottomTextLink.vue";
  import LabeledCheckboxInput from "@/presentation/components/partials/inputs/LabeledCheckboxInput.vue";
  import LabeledNumberInput from "@/presentation/components/partials/inputs/LabeledNumberInput.vue";
  import LabeledSelectionInput, {
    type SelectOption,
  } from "@/presentation/components/partials/inputs/LabeledSelectionInput.vue";
  import LabeledTextInput from "@/presentation/components/partials/inputs/LabeledTextInput.vue";

  const props = defineProps<{
    toJoinRoomRedirection: () => void;
    translator: (translationKey: string, values?: Record<string, string | number>) => string;
    onSubmitRoomCreationFormCallback: (createRoomOptions: CreateRoomOptions) => Promise<void>;
    isSubmitting: boolean;
    submissionError: string | null;
    clearSubmissionError: () => void;
  }>();

  type FieldErrors = {
    username?: string;
    gameLanguage?: string;
    maxPlayers?: string;
    gameDuration?: string;
    turnDurationInSeconds?: string;
  };

  const USERNAME_MIN_LENGTH = 2;

  const username = ref("");
  const gameLanguage = ref("fr");
  const maxPlayers = ref(4);
  const gameDuration = ref(3);
  const turnDurationInSeconds = ref(GameConstraints.ALLOWED_TURN_TIME_IN_SECONDS.default);
  const freedomOfLanguage = ref(true);
  const fieldErrors = ref<FieldErrors>({});

  const languageOptions = computed<SelectOption[]>(() =>
    SUPPORTED_ANSWER_VALIDATION_LANGUAGES.map((language) => ({
      label: props.translator(`LANGUAGES.${language.toUpperCase()}`),
      value: language,
    })),
  );

  watch(
    [username, gameLanguage, maxPlayers, gameDuration, turnDurationInSeconds, freedomOfLanguage],
    () => {
      props.clearSubmissionError();

      if (Object.keys(fieldErrors.value).length > 0) {
        validate();
      }
    },
  );

  function submit(): void {
    const trimmedUsername = username.value.trim();

    if (!validate()) {
      return;
    }

    props.onSubmitRoomCreationFormCallback({
      username: trimmedUsername,
      gameDurationInSeconds: gameDuration.value * 60,
      turnDurationInSeconds: turnDurationInSeconds.value,
      maxPlayersAllowed: maxPlayers.value,
      gameLanguage: getSelectedGameLanguage(),
      allowAnswerValidationInPlayerCurrentLanguage: freedomOfLanguage.value,
    });
  }

  function validate(): boolean {
    const nextErrors: FieldErrors = {};
    const trimmedUsername = username.value.trim();

    if (!trimmedUsername) {
      nextErrors.username = props.translator("VIEWS.FORMS.GAME_ROOM_LOBBYING.VALIDATION.REQUIRED");
    } else if (trimmedUsername.length < USERNAME_MIN_LENGTH) {
      nextErrors.username = props.translator(
        "VIEWS.FORMS.GAME_ROOM_LOBBYING.VALIDATION.USERNAME_MIN_LENGTH",
        {
          min: USERNAME_MIN_LENGTH,
        },
      );
    }

    if (!freedomOfLanguage.value && !gameLanguage.value) {
      nextErrors.gameLanguage = props.translator(
        "VIEWS.FORMS.GAME_ROOM_LOBBYING.VALIDATION.REQUIRED",
      );
    } else if (!freedomOfLanguage.value && !isSupportedLanguage(gameLanguage.value)) {
      nextErrors.gameLanguage = props.translator(
        "VIEWS.FORMS.GAME_ROOM_LOBBYING.VALIDATION.UNSUPPORTED_LANGUAGE",
      );
    }

    if (!isIntegerInRange(maxPlayers.value, GameConstraints.ALLOWED_PLAYERS_NUMBER)) {
      nextErrors.maxPlayers = props.translator(
        "VIEWS.FORMS.GAME_ROOM_LOBBYING.VALIDATION.NUMBER_RANGE",
        toTranslationRange(GameConstraints.ALLOWED_PLAYERS_NUMBER),
      );
    }

    if (!isIntegerInRange(gameDuration.value, GameConstraints.ALLOWED_TIME_IN_MINUTES)) {
      nextErrors.gameDuration = props.translator(
        "VIEWS.FORMS.GAME_ROOM_LOBBYING.VALIDATION.NUMBER_RANGE",
        toTranslationRange(GameConstraints.ALLOWED_TIME_IN_MINUTES),
      );
    }

    if (
      !isIntegerInRange(turnDurationInSeconds.value, GameConstraints.ALLOWED_TURN_TIME_IN_SECONDS)
    ) {
      nextErrors.turnDurationInSeconds = props.translator(
        "VIEWS.FORMS.GAME_ROOM_LOBBYING.VALIDATION.NUMBER_RANGE",
        toTranslationRange(GameConstraints.ALLOWED_TURN_TIME_IN_SECONDS),
      );
    }

    fieldErrors.value = nextErrors;

    return Object.keys(nextErrors).length === 0;
  }

  function isIntegerInRange(value: number, range: { min: number; max: number }): boolean {
    return Number.isInteger(value) && value >= range.min && value <= range.max;
  }

  function toTranslationRange(range: { min: number; max: number }): Record<string, number> {
    return {
      min: range.min,
      max: range.max,
    };
  }

  function getSelectedGameLanguage() {
    return isSupportedLanguage(gameLanguage.value) ? gameLanguage.value : "fr";
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

      <form class="mt-8 space-y-5" @submit.prevent="submit">
        <p
          v-if="submissionError"
          role="alert"
          class="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-100"
        >
          {{ submissionError }}
        </p>

        <LabeledTextInput
          id="username"
          v-model="username"
          :label="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_LABELS.USERNAME')"
          :hint="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.USERNAME')"
          :placeholder="
            translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.USERNAME_PLACEHOLDER')
          "
          autocomplete="off"
          :disabled="isSubmitting"
          :error="fieldErrors.username"
        />

        <LabeledCheckboxInput
          id="freedom-of-language"
          v-model="freedomOfLanguage"
          :label="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_LABELS.FREEDOM_OF_LANGUAGE')"
          :hint="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.FREEDOM_OF_LANGUAGE')"
          :description="
            translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.FREEDOM_OF_LANGUAGE')
          "
          :disabled="isSubmitting"
        />

        <LabeledSelectionInput
          v-if="!freedomOfLanguage"
          id="game-language"
          v-model="gameLanguage"
          :label="
            translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_LABELS.ANSWER_VALIDATION_LANGUAGE')
          "
          :hint="
            translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.ANSWER_VALIDATION_LANGUAGE')
          "
          :options="languageOptions"
          :disabled="isSubmitting"
          :error="fieldErrors.gameLanguage"
        />

        <LabeledNumberInput
          id="max-players"
          v-model="maxPlayers"
          :label="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_LABELS.MAX_PLAYER')"
          :hint="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.MAX_PLAYER')"
          :min="GameConstraints.ALLOWED_PLAYERS_NUMBER.min"
          :max="GameConstraints.ALLOWED_PLAYERS_NUMBER.max"
          :disabled="isSubmitting"
          :error="fieldErrors.maxPlayers"
        />

        <LabeledNumberInput
          id="game-duration"
          v-model="gameDuration"
          :label="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_LABELS.GAME_DURATION')"
          :hint="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.GAME_DURATION')"
          :min="GameConstraints.ALLOWED_TIME_IN_MINUTES.min"
          :max="GameConstraints.ALLOWED_TIME_IN_MINUTES.max"
          :disabled="isSubmitting"
          :error="fieldErrors.gameDuration"
        />

        <LabeledNumberInput
          id="turn-duration"
          v-model="turnDurationInSeconds"
          :label="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_LABELS.TURN_DURATION')"
          :hint="translator('VIEWS.FORMS.GAME_ROOM_LOBBYING.INPUT_HINTS.TURN_DURATION')"
          :min="GameConstraints.ALLOWED_TURN_TIME_IN_SECONDS.min"
          :max="GameConstraints.ALLOWED_TURN_TIME_IN_SECONDS.max"
          :disabled="isSubmitting"
          :error="fieldErrors.turnDurationInSeconds"
        />

        <button
          type="submit"
          :disabled="isSubmitting"
          class="flex w-full justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{
            isSubmitting
              ? translator("VIEWS.FORMS.GAME_ROOM_LOBBYING.BUTTONS.SUBMITTING")
              : translator("VIEWS.FORMS.GAME_ROOM_LOBBYING.BUTTONS.CREATE_ROOM")
          }}
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
