export type NotificationVariant = "game-finished" | "info" | "success" | "warning" | "error";

export type NotificationText =
  | string
  | {
      translationKey: string;
      values?: Record<string, string | number>;
    };

export type NotificationAction = {
  id: string;
  label: NotificationText;
  style?: "primary" | "secondary";
  closeOnClick?: boolean;
  run(): void;
};

export type Notification = {
  id: string;
  variant: NotificationVariant;
  title: NotificationText;
  message?: NotificationText;
  durationMs: number;
  actions: NotificationAction[];
};

export type NotificationRequest = {
  id?: string;
  variant?: NotificationVariant;
  title: NotificationText;
  message?: NotificationText;
  durationMs?: number;
  actions?: NotificationAction[];
};
