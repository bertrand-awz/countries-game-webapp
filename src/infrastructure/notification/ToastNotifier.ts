import { useNotificationStore } from "@/application/stores/notificationStore.ts";
import type { NotificationRequest } from "@/domain/notification/models/Notification.ts";
import type { Notifier } from "@/domain/notification/ports/Notifier.ts";

export class ToastNotifier implements Notifier {
  notify(notification: NotificationRequest): void {
    useNotificationStore().add(notification);
  }

  dismiss(notificationId: string): void {
    useNotificationStore().remove(notificationId);
  }
}
