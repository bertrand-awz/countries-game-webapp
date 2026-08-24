import { GameActionVoteRequestedReaction } from "@/application/reactions/game/GameActionVoteRequestedReaction.ts";
import { GameRoomNotificationReaction } from "@/application/reactions/game/GameRoomNotificationReaction.ts";
import {
  CURRENT_TURN_NOTIFICATION_ID,
  GameTurnChangedReaction,
} from "@/application/reactions/game/GameTurnChangedReaction.ts";
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
      () => {
        void this.leaveRoomAfterDecliningRestart();
      },
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
        if (this.isCurrentPlayerWaiting()) {
          return;
        }

        this.gameRoomNotificationReaction.handlePlayerJoinRoom(event);
      }),
      this.gameEventGateway.onPlayerLeftRoom((event) => {
        if (this.isCurrentPlayerWaiting()) {
          return;
        }

        this.gameRoomNotificationReaction.handlePlayerLeftRoom(event);
      }),
      this.gameEventGateway.onGameStarted((event) => {
        if (this.isCurrentPlayerWaiting()) {
          return;
        }

        this.gameRoomNotificationReaction.handleGameStarted(
          event,
          this.findPlayerUsername(event.startedByPlayerId),
        );
      }),
      this.gameEventGateway.onGamePaused(() => {
        this.gameTurnChangedReaction.clear();
      }),
      this.gameEventGateway.onGameResumed(() => {}),
      this.gameEventGateway.onTurnChanged((event) => {
        if (this.isCurrentPlayerWaiting()) {
          return;
        }

        this.gameSessionStore.setCurrentTurn({
          playerId: event.currentPlayer.getId(),
          startedAt: event.turnStartedAt,
          durationInSeconds: event.turnDurationInSeconds,
        });
        this.gameTurnChangedReaction.handle(event);
      }),
      this.gameEventGateway.onCountryFound((event) => {
        if (this.isCurrentPlayerWaiting()) {
          return;
        }

        this.gameSessionStore.recordCountryFound(event.countryId);
      }),
      this.gameEventGateway.onGameActionVoteRequested((event) => {
        if (this.isCurrentPlayerWaiting()) {
          return;
        }

        this.gameActionVoteRequestedReaction.handle(event);
      }),
      this.gameEventGateway.onGameFinished(() => {
        this.gameSessionStore.clearCurrentTurn();
        this.gameTurnChangedReaction.clear();
      }),
      this.gameEventGateway.onGameRestarted(() => {
        this.gameSessionStore.clearCurrentTurn();
        this.gameSessionStore.clearFoundCountries();
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

  private isCurrentPlayerWaiting(): boolean {
    return this.gameSessionStore.currentWaitingPlayer !== null;
  }

  private async leaveRoomAfterDecliningRestart(): Promise<void> {
    await this.gameRoomGateway.leaveRoom();
    this.clearSubscriptions();
    this.gameTurnChangedReaction.clear();
    this.notifier.dismiss(CURRENT_TURN_NOTIFICATION_ID);
    this.soundManager.stopAllSounds();
    this.gameSessionStore.reset();
  }
}
