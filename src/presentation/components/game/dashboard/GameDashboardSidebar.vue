<script setup lang="ts">
  import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";
  import GameDashboardSidebarContent from "./GameDashboardSidebarContent.vue";
  import type { SoundManager } from "@/domain/game/ports/SoundManager.ts";

  defineProps<{
    open: boolean;
    translator: (translationKey: string) => string;
    soundManager: SoundManager;
  }>();

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

            <GameDashboardSidebarContent class="navbar border-r" :sound-manager="soundManager" />
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Desktop sidebar -->
  <div class="hidden max-w-xs lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col">
    <GameDashboardSidebarContent class="navbar border-r" :sound-manager="soundManager" />
  </div>
</template>
