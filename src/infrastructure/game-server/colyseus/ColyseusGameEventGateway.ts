import type { Room } from "@colyseus/sdk";

import type { CountryFoundEvent } from "@/domain/game/events/CountryFoundEvent.ts";
import type { CountryRejectedEvent } from "@/domain/game/events/CountryRejectedEvent.ts";
import type {
  GameActionVote,
  GameActionVoteRequestedEvent,
} from "@/domain/game/events/GameActionVoteRequestedEvent.ts";
import type { GameFinishedEvent } from "@/domain/game/events/GameFinishedEvent.ts";
import type { GamePausedEvent } from "@/domain/game/events/GamePausedEvent.ts";
import type { GameRestartedEvent } from "@/domain/game/events/GameRestartedEvent.ts";
import type { GameResumedEvent } from "@/domain/game/events/GameResumedEvent.ts";
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

type EventCallback<TEvent> = (event: TEvent) => void;

const IGNORED_ROOM_MESSAGES = [
  GameRoomMessage.COUNTRY_SUBMITTED,
  GameRoomMessage.SUBMIT_COUNTRY_NAME_RESULT,
  GameRoomMessage.ROOM_SETTINGS_UPDATED,
  GameRoomMessage.UPDATE_ROOM_SETTINGS_REJECTED,
] as const;

export class ColyseusGameEventGateway implements GameEventGateway {
  private readonly stateChangeCallbacks = new Set<EventCallback<GameState>>();
  private readonly countryFoundCallbacks = new Set<EventCallback<CountryFoundEvent>>();
  private readonly countryRejectedCallbacks = new Set<EventCallback<CountryRejectedEvent>>();
  private readonly playerJoinRoomCallbacks = new Set<EventCallback<PlayerJoinRoomEvent>>();
  private readonly playerLeftRoomCallbacks = new Set<EventCallback<PlayerLeftRoomEvent>>();
  private readonly turnChangedCallbacks = new Set<EventCallback<TurnChangedEvent>>();
  private readonly gameStartedCallbacks = new Set<EventCallback<GameStartedEvent>>();
  private readonly gamePausedCallbacks = new Set<EventCallback<GamePausedEvent>>();
  private readonly gameResumedCallbacks = new Set<EventCallback<GameResumedEvent>>();
  private readonly gameRestartedCallbacks = new Set<EventCallback<GameRestartedEvent>>();
  private readonly gameActionVoteRequestedCallbacks =
    new Set<EventCallback<GameActionVoteRequestedEvent>>();
  private readonly gameFinishedCallbacks = new Set<EventCallback<GameFinishedEvent>>();
  private roomUnsubscriptions: Unsubscribe[] = [];
  private boundRoom: Room | null = null;

  constructor(private readonly roomGateway: ColyseusRoomGateway) {
    this.roomGateway.onActiveRoomChange((room) => this.bindActiveRoom(room));
  }

  onCountryFound(callback: (event: CountryFoundEvent) => void): Unsubscribe {
    return this.registerCallback(this.countryFoundCallbacks, callback);
  }

  onCountryRejected(callback: (event: CountryRejectedEvent) => void): Unsubscribe {
    return this.registerCallback(this.countryRejectedCallbacks, callback);
  }

  onStateChange(callback: (state: GameState) => void): Unsubscribe {
    return this.registerCallback(this.stateChangeCallbacks, callback);
  }

  onPlayerJoinRoom(callback: (event: PlayerJoinRoomEvent) => void): Unsubscribe {
    return this.registerCallback(this.playerJoinRoomCallbacks, callback);
  }

  onPlayerLeftRoom(callback: (event: PlayerLeftRoomEvent) => void): Unsubscribe {
    return this.registerCallback(this.playerLeftRoomCallbacks, callback);
  }

  onTurnChanged(callback: (event: TurnChangedEvent) => void): Unsubscribe {
    return this.registerCallback(this.turnChangedCallbacks, callback);
  }

  onGameStarted(callback: (event: GameStartedEvent) => void): Unsubscribe {
    return this.registerCallback(this.gameStartedCallbacks, callback);
  }

  onGamePaused(callback: (event: GamePausedEvent) => void): Unsubscribe {
    return this.registerCallback(this.gamePausedCallbacks, callback);
  }

  onGameResumed(callback: (event: GameResumedEvent) => void): Unsubscribe {
    return this.registerCallback(this.gameResumedCallbacks, callback);
  }

  onGameRestarted(callback: (event: GameRestartedEvent) => void): Unsubscribe {
    return this.registerCallback(this.gameRestartedCallbacks, callback);
  }

  onGameActionVoteRequested(callback: (event: GameActionVoteRequestedEvent) => void): Unsubscribe {
    return this.registerCallback(this.gameActionVoteRequestedCallbacks, callback);
  }

  onGameFinished(callback: (event: GameFinishedEvent) => void): Unsubscribe {
    return this.registerCallback(this.gameFinishedCallbacks, callback);
  }

  private bindActiveRoom(room: Room | null): void {
    if (this.boundRoom === room) {
      return;
    }

    this.clearRoomSubscriptions();
    this.boundRoom = room;

    if (!room) {
      return;
    }

    const stateChangeHandler = (colyseusState: unknown) => {
      this.emit(this.stateChangeCallbacks, GameStateMapper.fromColyseusState(colyseusState));
    };

    room.onStateChange(stateChangeHandler);

    this.roomUnsubscriptions = [
      () => room.onStateChange.remove(stateChangeHandler),
      room.onMessage(GameRoomMessage.COUNTRY_FOUND, (message) => {
        this.emit(this.countryFoundCallbacks, {
          countryId: message.countryId,
          foundByPlayer: message.player,
          pointsAwarded: message.pointsAwarded,
        });
      }),
      room.onMessage(GameRoomMessage.COUNTRY_REJECTED, (message) => {
        this.emit(this.countryRejectedCallbacks, {
          reason: message.reason,
        });
      }),
      room.onMessage(GameRoomMessage.PLAYER_JOIN_ROOM, (message) => {
        this.emit(this.playerJoinRoomCallbacks, {
          playerId: message.playerSessionId ?? message.player?.id,
          username: message.username ?? message.player?.username,
          numberOfPlayers: message.numberOfPlayers,
        });
      }),
      room.onMessage(GameRoomMessage.PLAYER_LEFT_ROOM, (message) => {
        this.emit(this.playerLeftRoomCallbacks, {
          playerId: message.playerSessionId ?? message.player?.id,
          username: message.username ?? message.player?.username,
          numberOfPlayers: message.numberOfPlayers,
          code: message.code,
        });
      }),
      room.onMessage(GameRoomMessage.TURN_CHANGED, (message) => {
        this.emit(this.turnChangedCallbacks, {
          currentPlayer: mapPlayer(message.player),
          turnDurationInSeconds: message.turnDurationInSeconds,
          turnStartedAt: message.turnStartedAt,
        });
      }),
      room.onMessage(GameRoomMessage.GAME_STARTED, (message) => {
        this.emit(this.gameStartedCallbacks, {
          startAt: message.startAt,
          endAt: message.endAt,
          durationInSeconds: message.durationInSeconds,
          currentPlayerId: message.currentPlayerSessionId,
          startedByPlayerId: message.startedBy,
        });
      }),
      room.onMessage(GameRoomMessage.GAME_PAUSED, (message) => {
        this.emit(this.gamePausedCallbacks, {
          pausedAt: message.pausedAt,
          pausedByPlayerId: message.pausedBy,
        });
      }),
      room.onMessage(GameRoomMessage.GAME_RESUMED, (message) => {
        this.emit(this.gameResumedCallbacks, {
          resumedAt: message.resumedAt,
          endAt: message.endAt,
          resumedByPlayerId: message.resumedBy,
        });
      }),
      room.onMessage(GameRoomMessage.GAME_RESTARTED, (message) => {
        this.emit(this.gameRestartedCallbacks, {
          restartedAt: message.restartedAt,
          currentPlayerId: message.currentPlayerSessionId,
          restartedByPlayerId: message.restartedBy,
        });
      }),
      room.onMessage(GameRoomMessage.PAUSE_GAME_REQUESTED, (message) => {
        this.emit(
          this.gameActionVoteRequestedCallbacks,
          mapGameActionVoteRequestedMessage("pause", message),
        );
      }),
      room.onMessage(GameRoomMessage.RESUME_GAME_REQUESTED, (message) => {
        this.emit(
          this.gameActionVoteRequestedCallbacks,
          mapGameActionVoteRequestedMessage("resume", message),
        );
      }),
      room.onMessage(GameRoomMessage.RESTART_GAME_REQUESTED, (message) => {
        this.emit(
          this.gameActionVoteRequestedCallbacks,
          mapGameActionVoteRequestedMessage("restart", message),
        );
      }),
      room.onMessage(GameRoomMessage.GAME_FINISHED, (message) => {
        this.emit(this.gameFinishedCallbacks, {
          winner: message.winner ?? message.player,
          reason: message.reason,
        });
      }),
      ...IGNORED_ROOM_MESSAGES.map((messageType) => room.onMessage(messageType, () => {})),
    ];
  }

  private clearRoomSubscriptions(): void {
    this.roomUnsubscriptions.forEach((unsubscribe) => unsubscribe());
    this.roomUnsubscriptions = [];
    this.boundRoom = null;
  }

  private registerCallback<TEvent>(
    callbacks: Set<EventCallback<TEvent>>,
    callback: EventCallback<TEvent>,
  ): Unsubscribe {
    callbacks.add(callback);

    return () => {
      callbacks.delete(callback);
    };
  }

  private emit<TEvent>(callbacks: Set<EventCallback<TEvent>>, event: TEvent): void {
    callbacks.forEach((callback) => callback(event));
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
