<script setup lang="ts">
  import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";
  import GameDashboardSidebarContent from "./GameDashboardSidebarContent.vue";

  defineProps<{
    open: boolean;
    navigation: {
      name: string;
      href: string;
      icon: unknown;
      current: boolean;
    }[];
    teams: {
      id: number;
      name: string;
      href: string;
      initial: string;
      current: boolean;
    }[];
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
          <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
            <TransitionChild
              as="template"
              enter="ease-in-out duration-300"
              enter-from="opacity-0"
              enter-to=""
              leave="ease-in-out duration-300"
              leave-from=""
              leave-to="opacity-0"
            >
              <div class="absolute top-0 left-full flex w-16 justify-center pt-5">
                
              </div>
            </TransitionChild>

            <GameDashboardSidebarContent
              :navigation="navigation"
              :teams="teams"
              class="navbar border-r"
            />
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Desktop sidebar -->
  <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
    <GameDashboardSidebarContent :navigation="navigation" :teams="teams" class="navbar border-r" />
  </div>
</template>
