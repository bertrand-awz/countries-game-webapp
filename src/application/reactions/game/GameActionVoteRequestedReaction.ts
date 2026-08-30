import type {
  GameActionVote,
  GameActionVoteRequestedEvent,
} from "@/domain/game/events/GameActionVoteRequestedEvent.ts";
import type { GameCommandGateway } from "@/domain/game/ports/GameServer.ts";
import type { Notifier } from "@/domain/notification/ports/Notifier.ts";

const NOTIFICATION_DURATION_MS = 5000;

type TranslationActionKey = "PAUSE" | "RESUME" | "RESTART";

export class GameActionVoteRequestedReaction {
  constructor(
    private readonly notifier: Notifier,
    private readonly gameCommandGateway: GameCommandGateway,
    private readonly getCurrentPlayerId: () => string | null,
    private readonly onRestartDeclined: () => void = () => {},
  ) {}

  handle(event: GameActionVoteRequestedEvent): void {
    const actionKey = toTranslationActionKey(event.action);
    const currentPlayerId = this.getCurrentPlayerId();
    const isRequester = currentPlayerId === event.requestedByPlayerId;

    this.notifier.notify({
      variant: isRequester ? "info" : "warning",
      title: {
        translationKey: isRequester
          ? `GAME.NOTIFICATIONS.VOTE_REQUESTS.WAITING.${actionKey}.TITLE`
          : `GAME.NOTIFICATIONS.VOTE_REQUESTS.${actionKey}.TITLE`,
      },
      message: {
        translationKey: isRequester
          ? `GAME.NOTIFICATIONS.VOTE_REQUESTS.WAITING.${actionKey}.MESSAGE`
          : `GAME.NOTIFICATIONS.VOTE_REQUESTS.${actionKey}.MESSAGE`,
        values: {
          username: event.requestedByUsername,
        },
      },
      durationMs: NOTIFICATION_DURATION_MS,
      actions: isRequester
        ? []
        : [
            {
              id: `${event.requestId}-accept`,
              label: {
                translationKey: "GAME.NOTIFICATIONS.VOTE_REQUESTS.ACTIONS.ACCEPT",
              },
              style: "primary",
              run: () => {
                this.gameCommandGateway.voteGameAction(event.action, event.requestId, true);
              },
            },
            {
              id: `${event.requestId}-decline`,
              label: {
                translationKey: "GAME.NOTIFICATIONS.VOTE_REQUESTS.ACTIONS.DECLINE",
              },
              style: "secondary",
              run: () => {
                this.gameCommandGateway.voteGameAction(event.action, event.requestId, false);

                if (event.action === "restart") {
                  this.onRestartDeclined();
                }
              },
            },
          ],
    });
  }
}

function toTranslationActionKey(action: GameActionVote): TranslationActionKey {
  return action.toUpperCase() as TranslationActionKey;
}
