import { GameActionVoteRequestedReaction } from "@/application/reactions/game/GameActionVoteRequestedReaction.ts";
import { GameRoomNotificationReaction } from "@/application/reactions/game/GameRoomNotificationReaction.ts";
import { GameTurnChangedReaction } from "@/application/reactions/game/GameTurnChangedReaction.ts";
import type { Unsubscribe } from "@/domain/game/ports/GameServer.ts";

import { UseCase } from "./useCase.ts";

export class RegisterGameEventReactionsUseCase extends UseCase<void, void> {
  private readonly gameRoomNotificationReaction: GameRoomNotificationReaction;
  private readonly gameActionVoteRequestedReaction: GameActionVoteRequestedReaction;
  private readonly gameTurnChangedReaction: GameTurnChangedReaction;
  private unsubscriptions: Unsubscribe[] = [];

  constructor() {
    super();
    this.gameRoomNotificationReaction = new GameRoomNotificationReaction(this.notifier);
    this.gameActionVoteRequestedReaction = new GameActionVoteRequestedReaction(
      this.notifier,
      this.gameCommandGateway,
      () => this.gameSessionStore.playerId,
    );
    this.gameTurnChangedReaction = new GameTurnChangedReaction(
      this.notifier,
      () => this.gameSessionStore.playerId,
    );
  }

  execute(): void {
    this.clearSubscriptions();

    this.unsubscriptions = [
      this.gameEventGateway.onPlayerJoinRoom((event) => {
        this.gameRoomNotificationReaction.handlePlayerJoinRoom(event);
      }),
      this.gameEventGateway.onPlayerLeftRoom((event) => {
        this.gameRoomNotificationReaction.handlePlayerLeftRoom(event);
      }),
      this.gameEventGateway.onGameStarted((event) => {
        this.gameRoomNotificationReaction.handleGameStarted(
          event,
          this.findPlayerUsername(event.startedByPlayerId),
        );
      }),
      this.gameEventGateway.onTurnChanged((event) => {
        this.gameTurnChangedReaction.handle(event);
      }),
      this.gameEventGateway.onGameActionVoteRequested((event) => {
        this.gameActionVoteRequestedReaction.handle(event);
      }),
      this.gameEventGateway.onGameFinished(() => {
        this.gameTurnChangedReaction.clear();
      }),
      this.gameEventGateway.onGameRestarted(() => {
        this.gameTurnChangedReaction.clear();
      }),
    ];
  }

  clearSubscriptions(): void {
    this.unsubscriptions.forEach((unsubscribe) => unsubscribe());
    this.unsubscriptions = [];
  }

  private findPlayerUsername(playerId: string | undefined): string | null {
    if (!playerId) {
      return null;
    }

    return (
      this.gameSessionStore.players.find((player) => player.getId() === playerId)?.getUsername() ??
      null
    );
  }
}
