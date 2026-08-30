import type { TurnChangedEvent } from "@/domain/game/events/TurnChangedEvent.ts";
import type { Notifier } from "@/domain/notification/ports/Notifier.ts";

export const CURRENT_TURN_NOTIFICATION_ID = "current-turn";

export class GameTurnChangedReaction {
  constructor(
    private readonly notifier: Notifier,
    private readonly getCurrentPlayerId: () => string | null,
  ) {}

  handle(event: TurnChangedEvent): void {
    const isLocalPlayerTurn = event.currentPlayer.getId() === this.getCurrentPlayerId();

    this.notifier.notify({
      id: CURRENT_TURN_NOTIFICATION_ID,
      variant: isLocalPlayerTurn ? "success" : "info",
      title: isLocalPlayerTurn
        ? {
            translationKey: "GAME.NOTIFICATIONS.TURN.YOUR_TURN_TITLE",
          }
        : {
            translationKey: "GAME.NOTIFICATIONS.TURN.PLAYER_TURN_TITLE",
            values: {
              username: event.currentPlayer.getUsername(),
            },
          },
      message: {
        translationKey: isLocalPlayerTurn
          ? "GAME.NOTIFICATIONS.TURN.YOUR_TURN_MESSAGE"
          : "GAME.NOTIFICATIONS.TURN.PLAYER_TURN_MESSAGE",
        values: {
          username: event.currentPlayer.getUsername(),
          seconds: event.turnDurationInSeconds,
        },
      },
      durationMs: 0,
      countdown: {
        startedAt: event.turnStartedAt,
        endsAt: event.turnStartedAt + event.turnDurationInSeconds * 1000,
      },
    });
  }

  clear(): void {
    this.notifier.dismiss(CURRENT_TURN_NOTIFICATION_ID);
  }
}
