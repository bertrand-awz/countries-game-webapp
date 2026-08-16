import type { NotificationRequest } from "@/domain/notification/models/Notification.ts";

export interface Notifier {
  notify(notification: NotificationRequest): void;
  dismiss(notificationId: string): void;
}
