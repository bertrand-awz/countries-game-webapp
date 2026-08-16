import type { CountryFoundEvent } from "@/domain/game/events/CountryFoundEvent.ts";
import type { CountryRejectedEvent } from "@/domain/game/events/CountryRejectedEvent.ts";
import type {
  GameActionVote,
  GameActionVoteRequestedEvent,
} from "@/domain/game/events/GameActionVoteRequestedEvent.ts";
import type { GameFinishedEvent } from "@/domain/game/events/GameFinishedEvent.ts";
import type { GameRestartedEvent } from "@/domain/game/events/GameRestartedEvent.ts";
import type { GameStartedEvent } from "@/domain/game/events/GameStartedEvent.ts";
import type { PlayerJoinRoomEvent } from "@/domain/game/events/PlayerJoinRoomEvent.ts";
import type { PlayerLeftRoomEvent } from "@/domain/game/events/PlayerLeftRoomEvent.ts";
import type { TurnChangedEvent } from "@/domain/game/events/TurnChangedEvent.ts";
import { Player } from "@/domain/game/models/Player.ts";
import type { GameState } from "@/domain/game/models/state/GameState.ts";
import type { GameEventGateway, Unsubscribe } from "@/domain/game/ports/GameServer.ts";

import type { ColyseusRoomGateway } from "./ColyseusRoomGateway.js";
import { GameStateMapper } from "./mappers/GameStateMapper.js";
import { GameRoomMessage } from "./messages/GameRoomMessage.js";

export class ColyseusGameEventGateway implements GameEventGateway {
  constructor(private readonly roomGateway: ColyseusRoomGateway) {}

  onCountryFound(callback: (event: CountryFoundEvent) => void): Unsubscribe {
    return this.roomGateway.getActiveRoom().onMessage(GameRoomMessage.COUNTRY_FOUND, (message) => {
      callback({
        countryId: message.countryId,
        foundByPlayer: message.player,
        pointsAwarded: message.pointsAwarded,
      });
    });
  }

  onCountryRejected(callback: (event: CountryRejectedEvent) => void): Unsubscribe {
    return this.roomGateway
      .getActiveRoom()
      .onMessage(GameRoomMessage.COUNTRY_REJECTED, (message) => {
        callback({
          reason: message.reason,
        });
      });
  }

  onStateChange(callback: (state: GameState) => void): Unsubscribe {
    const room = this.roomGateway.getActiveRoom();
    const stateChangeHandler = (colyseusState: unknown) => {
      callback(GameStateMapper.fromColyseusState(colyseusState));
    };

    room.onStateChange(stateChangeHandler);

    return () => room.onStateChange.remove(stateChangeHandler);
  }

  onPlayerJoinRoom(callback: (event: PlayerJoinRoomEvent) => void): Unsubscribe {
    return this.roomGateway
      .getActiveRoom()
      .onMessage(GameRoomMessage.PLAYER_JOIN_ROOM, (message) => {
        callback({
          playerId: message.playerSessionId ?? message.player?.id,
          username: message.username ?? message.player?.username,
          numberOfPlayers: message.numberOfPlayers,
        });
      });
  }

  onPlayerLeftRoom(callback: (event: PlayerLeftRoomEvent) => void): Unsubscribe {
    return this.roomGateway
      .getActiveRoom()
      .onMessage(GameRoomMessage.PLAYER_LEFT_ROOM, (message) => {
        callback({
          playerId: message.playerSessionId ?? message.player?.id,
          username: message.username ?? message.player?.username,
          numberOfPlayers: message.numberOfPlayers,
          code: message.code,
        });
      });
  }

  onTurnChanged(callback: (event: TurnChangedEvent) => void): Unsubscribe {
    return this.roomGateway.getActiveRoom().onMessage(GameRoomMessage.TURN_CHANGED, (message) => {
      callback({
        currentPlayer: mapPlayer(message.player),
        turnDurationInSeconds: message.turnDurationInSeconds,
        turnStartedAt: message.turnStartedAt,
      });
    });
  }

  onGameStarted(callback: (event: GameStartedEvent) => void): Unsubscribe {
    return this.roomGateway.getActiveRoom().onMessage(GameRoomMessage.GAME_STARTED, (message) => {
      callback({
        startAt: message.startAt,
        endAt: message.endAt,
        durationInSeconds: message.durationInSeconds,
        currentPlayerId: message.currentPlayerSessionId,
        startedByPlayerId: message.startedBy,
      });
    });
  }

  onGameRestarted(callback: (event: GameRestartedEvent) => void): Unsubscribe {
    return this.roomGateway.getActiveRoom().onMessage(GameRoomMessage.GAME_RESTARTED, (message) => {
      callback({
        restartedAt: message.restartedAt,
        currentPlayerId: message.currentPlayerSessionId,
        restartedByPlayerId: message.restartedBy,
      });
    });
  }

  onGameActionVoteRequested(
    callback: (event: GameActionVoteRequestedEvent) => void,
  ): Unsubscribe {
    const room = this.roomGateway.getActiveRoom();
    const unsubscriptions = (
      [
        ["pause", GameRoomMessage.PAUSE_GAME_REQUESTED],
        ["resume", GameRoomMessage.RESUME_GAME_REQUESTED],
        ["restart", GameRoomMessage.RESTART_GAME_REQUESTED],
      ] as const
    ).map(([action, messageType]) =>
      room.onMessage(messageType, (message) => {
        callback(mapGameActionVoteRequestedMessage(action, message));
      }),
    );

    return () => {
      unsubscriptions.forEach((unsubscribe) => unsubscribe());
    };
  }

  onGameFinished(callback: (event: GameFinishedEvent) => void): Unsubscribe {
    return this.roomGateway.getActiveRoom().onMessage(GameRoomMessage.GAME_FINISHED, (message) => {
      callback({
        winner: message.winner ?? message.player,
        reason: message.reason,
      });
    });
  }
}

function mapPlayer(messagePlayer: {
  id: string;
  username: string;
  score?: number;
  totalCountriesFound?: number;
}): Player {
  if (typeof (messagePlayer as unknown as Player).getId === "function") {
    return messagePlayer as unknown as Player;
  }

  const player = new Player(messagePlayer.id, messagePlayer.username, messagePlayer.score ?? 0);
  player.updateTotalCountriesFound(messagePlayer.totalCountriesFound ?? 0);

  return player;
}

function mapGameActionVoteRequestedMessage(
  action: GameActionVote,
  message: Record<string, unknown>,
): GameActionVoteRequestedEvent {
  return {
    requestId: String(message.requestId),
    action,
    requestedByPlayerId: String(message.requestedByPlayerSessionId ?? message.requestedByPlayerId),
    requestedByUsername: String(message.requestedByUsername),
    requiredVoterIds: Array.isArray(message.requiredVoterSessionIds)
      ? message.requiredVoterSessionIds.map(String)
      : [],
  };
}
