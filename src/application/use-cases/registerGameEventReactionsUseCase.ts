import { GameActionVoteRequestedReaction } from "@/application/reactions/game/GameActionVoteRequestedReaction.ts";
import { GameRoomNotificationReaction } from "@/application/reactions/game/GameRoomNotificationReaction.ts";
import {
  CURRENT_TURN_NOTIFICATION_ID,
  GameTurnChangedReaction,
} from "@/application/reactions/game/GameTurnChangedReaction.ts";
import type { Unsubscribe } from "@/domain/game/ports/GameServer.ts";
import { SoundEffectName } from "@/domain/game/ports/SoundManager.ts";

import { UseCase } from "./useCase.ts";

export class RegisterGameEventReactionsUseCase extends UseCase<void, void> {
  private unsubscribeCallbacks: Unsubscribe[] = [];

  execute(): void {
    this.clearSubscriptions();

    this.unsubscribeCallbacks = [
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
        this.soundManager.playMainThemeSound();
      }),
      this.gameEventGateway.onGamePaused(() => {
        this.gameTurnChangedReaction.clear();
      }),
      this.gameEventGateway.onGameResumed(() => {}),
      this.gameEventGateway.onTurnChanged((event) => {
        if (this.isCurrentPlayerWaiting()) {
          return;
        }

        const effectiveTurnDurationInSeconds = this.getEffectiveTurnDurationInSeconds(
          event.turnStartedAt,
          event.turnDurationInSeconds,
        );
        const effectiveTurnChangedEvent = {
          ...event,
          turnDurationInSeconds: effectiveTurnDurationInSeconds,
        };

        this.gameSessionStore.setCurrentTurn({
          playerId: event.currentPlayer.getId(),
          startedAt: event.turnStartedAt,
          durationInSeconds: effectiveTurnDurationInSeconds,
        });
        this.gameTurnChangedReaction.handle(effectiveTurnChangedEvent);
      }),
      this.gameEventGateway.onCountryFound((event) => {
        if (this.isCurrentPlayerWaiting()) {
          return;
        }

        this.gameSessionStore.recordCountryFound(event.countryId, event.foundByPlayer);
        this.soundManager.playEffect(SoundEffectName.SUCCESS);
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
        this.soundManager.stopMainThemeSound();
      }),
      this.gameEventGateway.onGameRestarted(() => {
        this.gameSessionStore.clearCurrentTurn();
        this.gameSessionStore.clearFoundCountries();
        this.gameTurnChangedReaction.clear();
        this.soundManager.stopMainThemeSound();
      }),
    ];
  }

  clearSubscriptions(): void {
    this.unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
    this.unsubscribeCallbacks = [];
  }

  private get gameRoomNotificationReaction(): GameRoomNotificationReaction {
    return new GameRoomNotificationReaction(this.notifier);
  }

  private get gameActionVoteRequestedReaction(): GameActionVoteRequestedReaction {
    return new GameActionVoteRequestedReaction(
      this.notifier,
      this.gameCommandGateway,
      () => this.gameSessionStore.playerId,
      () => {
        void this.leaveRoomAfterDecliningRestart();
      },
    );
  }

  private get gameTurnChangedReaction(): GameTurnChangedReaction {
    return new GameTurnChangedReaction(this.notifier, () => this.gameSessionStore.playerId);
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

  private getEffectiveTurnDurationInSeconds(
    turnStartedAt: number,
    serverTurnDurationInSeconds: number,
  ): number {
    const roomTurnDurationInSeconds =
      this.gameSessionStore.gameState?.turnDurationInSeconds ?? serverTurnDurationInSeconds;
    const gameEndAt = this.gameSessionStore.gameState?.endAt;

    if (!gameEndAt) {
      return roomTurnDurationInSeconds;
    }

    const remainingGameTimeInSeconds = Math.ceil((gameEndAt - turnStartedAt) / 1000);

    return Math.max(0, Math.min(roomTurnDurationInSeconds, remainingGameTimeInSeconds));
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
