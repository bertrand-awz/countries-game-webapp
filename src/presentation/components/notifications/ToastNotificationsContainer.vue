<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import { computed } from "vue";

  import { useNotificationStore } from "@/application/stores/notificationStore.ts";

  import ToastNotification from "./ToastNotification.vue";

  const notificationStore = useNotificationStore();
  const { notifications } = storeToRefs(notificationStore);

  const temporaryNotifications = computed(() => {
    return notifications.value.filter((notification) => notification.durationMs > 0);
  });

  const permanentNotifications = computed(() => {
    return notifications.value.filter((notification) => notification.durationMs <= 0);
  });
</script>

<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed top-16 right-0 left-0 z-[80] flex items-start px-4 py-4 sm:p-6"
  >
    <TransitionGroup
      tag="div"
      class="flex w-full flex-col items-end gap-3"
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      move-class="transition-transform duration-200 ease-out"
    >
      <ToastNotification
        v-for="notification in temporaryNotifications"
        :key="notification.id"
        :notification="notification"
        @close="notificationStore.remove"
      />
    </TransitionGroup>
  </div>

  <div
    aria-live="polite"
    class="pointer-events-none fixed right-0 bottom-0 left-0 z-[80] flex items-end px-4 py-4 sm:p-6"
  >
    <TransitionGroup
      tag="div"
      class="flex w-full flex-col-reverse items-end gap-3"
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      move-class="transition-transform duration-200 ease-out"
    >
      <ToastNotification
        v-for="notification in permanentNotifications"
        :key="notification.id"
        :notification="notification"
        @close="notificationStore.remove"
      />
    </TransitionGroup>
  </div>
</template>
