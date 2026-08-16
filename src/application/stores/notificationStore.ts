import { defineStore } from "pinia";
import { ref } from "vue";

import type {
  Notification,
  NotificationRequest,
} from "@/domain/notification/models/Notification.ts";

const DEFAULT_NOTIFICATION_DURATION_MS = 5000;

let notificationSequence = 0;

function createNotificationId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  notificationSequence++;
  return `notification-${Date.now()}-${notificationSequence}`;
}

export const useNotificationStore = defineStore("notifications", () => {
  const notifications = ref<Notification[]>([]);
  const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

  function add(notificationRequest: NotificationRequest): Notification {
    const notification: Notification = {
      id: notificationRequest.id ?? createNotificationId(),
      variant: notificationRequest.variant ?? "info",
      title: notificationRequest.title,
      message: notificationRequest.message,
      durationMs: notificationRequest.durationMs ?? DEFAULT_NOTIFICATION_DURATION_MS,
      actions: notificationRequest.actions ?? [],
    };

    notifications.value = [...notifications.value, notification];

    if (notification.durationMs > 0) {
      const timeout = setTimeout(() => {
        remove(notification.id);
      }, notification.durationMs);

      timeouts.set(notification.id, timeout);
    }

    return notification;
  }

  function remove(notificationId: string): void {
    notifications.value = notifications.value.filter(
      (notification) => notification.id !== notificationId,
    );

    const timeout = timeouts.get(notificationId);
    if (timeout) {
      clearTimeout(timeout);
      timeouts.delete(notificationId);
    }
  }

  function clear(): void {
    notifications.value = [];
    timeouts.forEach((timeout) => clearTimeout(timeout));
    timeouts.clear();
  }

  return {
    notifications,
    add,
    remove,
    clear,
  };
});
