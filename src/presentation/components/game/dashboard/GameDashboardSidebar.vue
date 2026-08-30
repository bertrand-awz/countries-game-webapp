<script setup lang="ts">
  import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";

  import type { Player } from "@/domain/game/models/Player.ts";
  import type { GameState } from "@/domain/game/models/state/GameState.ts";
  import type { SoundManager } from "@/domain/game/ports/SoundManager.ts";
  import type { GameSetting } from "@/domain/game/settings";
  import type { AnswerValidationLanguage } from "@/domain/shared/models/SupportedLanguage.ts";

  import GameDashboardSidebarContent from "./GameDashboardSidebarContent.vue";

  defineProps<{
    open: boolean;
    roomId: string | null;
    currentPlayer: Player;
    translator: (translationKey: string) => string;
    soundManager: SoundManager;
    applySettingCallback: (newSettings: GameSetting) => void;
    updateAnswerValidationLanguageCallback: (language: AnswerValidationLanguage) => void;
  }>();

  const gameState = defineModel<GameState>("gameState", { required: true });

  const emit = defineEmits<{
    "update:open": [value: boolean];
  }>();

  function closeSidebar() {
    emit("update:open", false);
  }
</script>

<template>
  <!-- Mobile sidebar -->
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-40 lg:hidden" @close="closeSidebar">
      <TransitionChild
        as="template"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to=""
        leave="transition-opacity ease-linear duration-300"
        leave-from=""
        leave-to="opacity-0"
      >
        <div class="fixed inset-0"></div>
      </TransitionChild>

      <div class="fixed inset-0 flex">
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <DialogPanel class="relative flex w-full max-w-xs flex-1">
            <TransitionChild
              as="template"
              enter="ease-in-out duration-300"
              enter-from="opacity-0"
              enter-to=""
              leave="ease-in-out duration-300"
              leave-from=""
              leave-to="opacity-0"
            >
              <div class="absolute top-0 left-full flex w-16 justify-center pt-5"></div>
            </TransitionChild>

            <GameDashboardSidebarContent
              class="navbar border-r"
              :game-state="gameState"
              :current-player="currentPlayer"
              :room-id="roomId"
              :sound-manager="soundManager"
              :apply-setting-callback="applySettingCallback"
              :update-answer-validation-language-callback="updateAnswerValidationLanguageCallback"
              :translator="translator"
            />
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Desktop sidebar -->
  <div class="hidden max-w-xs lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col">
    <GameDashboardSidebarContent
      class="navbar border-r"
      :game-state="gameState"
      :current-player="currentPlayer"
      :room-id="roomId"
      :sound-manager="soundManager"
      :apply-setting-callback="applySettingCallback"
      :update-answer-validation-language-callback="updateAnswerValidationLanguageCallback"
      :translator="translator"
    />
  </div>
</template>
