import type { Notifier } from "@/domain/notification/ports/Notifier.ts";

export class GameFinishedReaction {
  constructor(private readonly notifier: Notifier) {}

  handle(): void {
    this.notifier.notify({
      variant: "game-finished",
      title: {
        translationKey: "GAME.NOTIFICATIONS.GAME_FINISHED.TITLE",
      },
      message: {
        translationKey: "GAME.NOTIFICATIONS.GAME_FINISHED.MESSAGE",
      },
      durationMs: 5000,
    });
  }
}
