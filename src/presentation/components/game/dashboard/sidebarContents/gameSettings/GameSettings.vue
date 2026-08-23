<script setup lang="ts">
  import {
    CheckIcon,
    CopyIcon,
    LinkIcon,
    SettingsIcon,
    Share2Icon,
    TimerIcon,
    TimerResetIcon,
    UsersRoundIcon,
    XIcon,
  } from "@lucide/vue";
  import { computed, onBeforeUnmount, ref } from "vue";
  import { useRouter } from "vue-router";

  import { RouteName } from "@/app/router/routeName.ts";
  import { GameConstraints } from "@/domain/game/constraints/gameConstraints.ts";
  import type { GameSetting } from "@/domain/game/settings";
  import InputRangeSlider from "@/presentation/components/partials/inputs/InputRangeSlider.vue";

  const props = defineProps<{
    translator: (translationKey: string) => string;
    roomId: string | null;
    gameDurationInMinutes: number;
    maxPlayersAllowed: number;
    turnDurationInSeconds: number;
    applySettingCallback: (newSettings: GameSetting) => void;
  }>();

  type CopiedItem = "roomId" | "invitationLink";

  const router = useRouter();
  const isSettingsOpen = ref(false);
  const copiedItem = ref<CopiedItem | null>(null);
  let copiedFeedbackTimeoutId: number | null = null;

  const maxPlayersAllowed = ref(props.maxPlayersAllowed);
  const timerMinutes = ref(props.gameDurationInMinutes);
  const turnDurationInSeconds = ref(props.turnDurationInSeconds);

  const invitationLink = computed(() => {
    if (!props.roomId) {
      return "";
    }

    const route = router.resolve({
      name: RouteName.GAME_ROOM_AUTOMATIC_JOINING,
      params: { roomId: props.roomId },
    });

    return new URL(route.href, window.location.origin).toString();
  });

  function openSettingsModal() {
    maxPlayersAllowed.value = props.maxPlayersAllowed;
    timerMinutes.value = props.gameDurationInMinutes;
    turnDurationInSeconds.value = props.turnDurationInSeconds;
    isSettingsOpen.value = true;
  }

  function closeSettingsModal() {
    isSettingsOpen.value = false;
  }

  function applySettings() {
    const newSettings = {
      maxPlayersAllowed: maxPlayersAllowed.value,
      durationInMinutes: timerMinutes.value,
      turnDurationInSeconds: turnDurationInSeconds.value,
    };
    props.applySettingCallback(newSettings);
    closeSettingsModal();
  }

  async function copyRoomId() {
    if (!props.roomId) {
      return;
    }

    await copyToClipboard(props.roomId, "roomId");
  }

  async function invitePlayers() {
    if (!invitationLink.value) {
      return;
    }

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: props.translator("GAME.SIDEBAR.SETTINGS.MODAL.INVITE_TITLE"),
          text: props.translator("GAME.SIDEBAR.SETTINGS.MODAL.INVITE_MESSAGE"),
          url: invitationLink.value,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    await copyInvitationLink();
  }

  async function copyInvitationLink() {
    await copyToClipboard(invitationLink.value, "invitationLink");
  }

  async function copyToClipboard(text: string, item: CopiedItem) {
    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      copyTextWithFallback(text);
    }

    showCopiedFeedback(item);
  }

  function copyTextWithFallback(text: string) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  }

  function showCopiedFeedback(item: CopiedItem) {
    copiedItem.value = item;

    if (copiedFeedbackTimeoutId !== null) {
      window.clearTimeout(copiedFeedbackTimeoutId);
    }

    copiedFeedbackTimeoutId = window.setTimeout(() => {
      copiedItem.value = null;
      copiedFeedbackTimeoutId = null;
    }, 2000);
  }

  onBeforeUnmount(() => {
    if (copiedFeedbackTimeoutId !== null) {
      window.clearTimeout(copiedFeedbackTimeoutId);
    }
  });
</script>

<template>
  <div class="mt-auto">
    <button
      type="button"
      class="flex w-full items-center gap-x-2 rounded-lg px-2 py-2 text-sm font-semibold text-gray-200 transition hover:bg-white/5 hover:text-white"
      @click="openSettingsModal"
    >
      <SettingsIcon class="size-5 text-gray-400" />
      <span>{{ translator("GAME.SIDEBAR.SETTINGS.TITLE") }}</span>
    </button>
  </div>

  <Teleport to="body">
    <div
      v-if="isSettingsOpen"
      class="font-mono-app fixed inset-0 z-50 flex items-center justify-center px-4 text-white"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeSettingsModal" />

      <!-- Modal -->
      <section class="modal relative z-10">
        <div class="mb-5 flex items-center justify-between">
          <div class="flex items-center gap-x-2">
            <SettingsIcon class="size-5 text-gray-500" />
            <h2 class="text-lg font-bold">{{ translator("GAME.SIDEBAR.SETTINGS.TITLE") }}</h2>
          </div>

          <button
            type="button"
            class="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
            @click="closeSettingsModal"
          >
            <XIcon class="size-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="space-y-4">
          <div class="rounded-lg bg-white/5 px-3 py-3">
            <div class="mb-2 flex items-center gap-x-2">
              <LinkIcon class="size-4 text-emerald-300" />
              <span class="text-sm font-normal">
                {{ translator("GAME.SIDEBAR.SETTINGS.MODAL.ROOM_ID") }}
              </span>
            </div>

            <div class="flex items-center gap-x-2">
              <code
                class="min-w-0 flex-1 truncate rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm font-semibold text-white"
              >
                {{ roomId ?? translator("GAME.SIDEBAR.SETTINGS.MODAL.ROOM_ID_UNAVAILABLE") }}
              </code>

              <button
                type="button"
                class="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-gray-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                :title="translator('GAME.SIDEBAR.SETTINGS.MODAL.COPY_ROOM_ID')"
                :disabled="!roomId"
                @click="copyRoomId"
              >
                <CheckIcon v-if="copiedItem === 'roomId'" class="size-4 text-emerald-300" />
                <CopyIcon v-else class="size-4" />
              </button>
            </div>
          </div>

          <div class="rounded-lg bg-white/5 px-3 py-3">
            <div class="mb-2 flex items-center gap-x-2">
              <Share2Icon class="size-4 text-emerald-300" />
              <span class="text-sm font-normal">
                {{ translator("GAME.SIDEBAR.SETTINGS.MODAL.INVITATION_LINK") }}
              </span>
            </div>

            <div class="flex items-center gap-x-2">
              <p
                class="min-w-0 flex-1 truncate rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-gray-300"
              >
                {{
                  invitationLink ||
                  translator("GAME.SIDEBAR.SETTINGS.MODAL.INVITATION_LINK_UNAVAILABLE")
                }}
              </p>

              <button
                type="button"
                class="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-gray-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                :title="translator('GAME.SIDEBAR.SETTINGS.MODAL.COPY_INVITATION_LINK')"
                :disabled="!invitationLink"
                @click="copyInvitationLink"
              >
                <CheckIcon v-if="copiedItem === 'invitationLink'" class="size-4 text-emerald-300" />
                <CopyIcon v-else class="size-4" />
              </button>
            </div>
          </div>

          <InputRangeSlider
            v-model:input-value="maxPlayersAllowed"
            :label="translator('GAME.SIDEBAR.SETTINGS.MODAL.MAX_PLAYERS_ALLOWED')"
            label-class="text-sm font-normal"
            :icon-component="UsersRoundIcon"
            :icon-color-class="'size-4 text-emerald-300'"
            :minimum="GameConstraints.ALLOWED_PLAYERS_NUMBER.min"
            :maximum="GameConstraints.ALLOWED_PLAYERS_NUMBER.max"
            unit=""
          />

          <InputRangeSlider
            v-model:input-value="timerMinutes"
            :label="translator('GAME.SIDEBAR.SETTINGS.MODAL.GAME_DURATION')"
            label-class="text-sm font-normal"
            :icon-component="TimerIcon"
            :icon-color-class="'size-4 text-emerald-300'"
            :minimum="GameConstraints.ALLOWED_TIME_IN_MINUTES.min"
            :maximum="GameConstraints.ALLOWED_TIME_IN_MINUTES.max"
            :unit="translator('GAME.SIDEBAR.SETTINGS.MODAL.GAME_DURATION_UNIT')"
          />

          <InputRangeSlider
            v-model:input-value="turnDurationInSeconds"
            :label="translator('GAME.SIDEBAR.SETTINGS.MODAL.TURN_DURATION')"
            label-class="text-sm font-normal"
            :icon-component="TimerResetIcon"
            :icon-color-class="'size-4 text-cyan-300'"
            :minimum="GameConstraints.ALLOWED_TURN_TIME_IN_SECONDS.min"
            :maximum="GameConstraints.ALLOWED_TURN_TIME_IN_SECONDS.max"
            :unit="translator('GAME.SIDEBAR.SETTINGS.MODAL.TURN_DURATION_UNIT')"
          />
        </div>

        <!-- Footer -->
        <div class="mt-5 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            class="inline-flex items-center gap-x-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!invitationLink"
            @click="invitePlayers"
          >
            <CheckIcon v-if="copiedItem === 'invitationLink'" class="size-4" />
            <Share2Icon v-else class="size-4" />
            <span>
              {{
                copiedItem === "invitationLink"
                  ? translator("GAME.SIDEBAR.SETTINGS.MODAL.INVITATION_LINK_COPIED")
                  : translator("GAME.SIDEBAR.SETTINGS.MODAL.BUTTON_INVITE")
              }}
            </span>
          </button>

          <button
            type="button"
            class="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            @click="applySettings"
          >
            {{ translator("GAME.SIDEBAR.SETTINGS.MODAL.BUTTON_APPLY") }}
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
