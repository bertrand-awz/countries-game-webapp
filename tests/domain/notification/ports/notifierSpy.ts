import type { NotificationRequest } from "@/domain/notification/models/Notification.ts";
import type { Notifier } from "@/domain/notification/ports/Notifier.ts";

export class NotifierSpy implements Notifier {
  notifications: NotificationRequest[] = [];
  dismissedNotificationIds: string[] = [];

  notify(notification: NotificationRequest): void {
    this.notifications.push(notification);
  }

  dismiss(notificationId: string): void {
    this.dismissedNotificationIds.push(notificationId);
  }
}
