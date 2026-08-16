<script setup lang="ts">
  import { storeToRefs } from "pinia";

  import { useNotificationStore } from "@/application/stores/notificationStore.ts";

  import ToastNotification from "./ToastNotification.vue";

  const notificationStore = useNotificationStore();
  const { notifications } = storeToRefs(notificationStore);
</script>

<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 z-[80] flex items-end px-4 py-6 sm:items-start sm:p-6"
  >
    <TransitionGroup
      tag="div"
      class="flex w-full flex-col items-center gap-3 sm:items-end"
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      move-class="transition-transform duration-200 ease-out"
    >
      <ToastNotification
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
        @close="notificationStore.remove"
      />
    </TransitionGroup>
  </div>
</template>
