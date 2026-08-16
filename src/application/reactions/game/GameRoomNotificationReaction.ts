import type { GameStartedEvent } from "@/domain/game/events/GameStartedEvent.ts";
import type { PlayerJoinRoomEvent } from "@/domain/game/events/PlayerJoinRoomEvent.ts";
import type { PlayerLeftRoomEvent } from "@/domain/game/events/PlayerLeftRoomEvent.ts";
import type { Notifier } from "@/domain/notification/ports/Notifier.ts";

const NOTIFICATION_DURATION_MS = 5000;

export class GameRoomNotificationReaction {
  constructor(private readonly notifier: Notifier) {}

  handlePlayerJoinRoom(event: PlayerJoinRoomEvent): void {
    this.notifier.notify({
      variant: "success",
      title: {
        translationKey: "GAME.NOTIFICATIONS.PLAYER_JOINED.TITLE",
      },
      message: {
        translationKey: "GAME.NOTIFICATIONS.PLAYER_JOINED.MESSAGE",
        values: {
          username: event.username,
          numberOfPlayers: event.numberOfPlayers,
        },
      },
      durationMs: NOTIFICATION_DURATION_MS,
    });
  }

  handlePlayerLeftRoom(event: PlayerLeftRoomEvent): void {
    this.notifier.notify({
      variant: "warning",
      title: {
        translationKey: "GAME.NOTIFICATIONS.PLAYER_LEFT.TITLE",
      },
      message: {
        translationKey: "GAME.NOTIFICATIONS.PLAYER_LEFT.MESSAGE",
        values: {
          username: event.username,
          numberOfPlayers: event.numberOfPlayers,
        },
      },
      durationMs: NOTIFICATION_DURATION_MS,
    });
  }

  handleGameStarted(event: GameStartedEvent, startedByUsername: string | null): void {
    void event;

    this.notifier.notify({
      variant: "info",
      title: {
        translationKey: "GAME.NOTIFICATIONS.GAME_STARTED.TITLE",
      },
      message: startedByUsername
        ? {
            translationKey: "GAME.NOTIFICATIONS.GAME_STARTED.MESSAGE",
            values: {
              username: startedByUsername,
            },
          }
        : {
            translationKey: "GAME.NOTIFICATIONS.GAME_STARTED.MESSAGE_WITHOUT_PLAYER",
          },
      durationMs: NOTIFICATION_DURATION_MS,
    });
  }
}
