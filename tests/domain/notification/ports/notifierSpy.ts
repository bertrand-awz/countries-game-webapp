import type { NotificationRequest } from "@/domain/notification/models/Notification.ts";
import type { Notifier } from "@/domain/notification/ports/Notifier.ts";

export class NotifierSpy implements Notifier {
  notifications: NotificationRequest[] = [];

  notify(notification: NotificationRequest): void {
    this.notifications.push(notification);
  }
}
