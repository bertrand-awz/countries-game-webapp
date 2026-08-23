import type { CountryFoundEvent } from "@/domain/game/events/CountryFoundEvent.ts";
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
import type { GameState } from "@/domain/game/models/state/GameState.ts";
import type {
  CreateRoomOptions,
  GameCommandGateway,
  GameEventGateway,
  GameRoomGateway,
  GameSession,
  JoinRoomOptions,
  Unsubscribe,
  UpdateRoomSettingsOptions,
} from "@/domain/game/ports/GameServer.ts";

import { createGameState } from "../models/state/gameStateMother.ts";

export class GameServerSpy implements GameRoomGateway, GameCommandGateway, GameEventGateway {
  roomCreatedWith: CreateRoomOptions | null = null;
  roomJoinedWith: JoinRoomOptions | null = null;
  submittedCountries: string[] = [];
  pauseGameCallCount = 0;
  resumeGameCallCount = 0;
  restartGameCallCount = 0;
  startGameCallCount = 0;
  leaveRoomCallCount = 0;
  roomSettingsUpdatedWith: UpdateRoomSettingsOptions | null = null;
  voteGameActionCalls: Array<{
    action: GameActionVote;
    requestId: string;
    accepted: boolean;
  }> = [];
  stateChangeSubscriptionCount = 0;
  stateChangeUnsubscriptionCount = 0;
  playerJoinRoomSubscriptionCount = 0;
  playerJoinRoomUnsubscriptionCount = 0;
  playerLeftRoomSubscriptionCount = 0;
  playerLeftRoomUnsubscriptionCount = 0;
  gameStartedSubscriptionCount = 0;
  gameStartedUnsubscriptionCount = 0;
  gamePausedSubscriptionCount = 0;
  gamePausedUnsubscriptionCount = 0;
  gameResumedSubscriptionCount = 0;
  gameResumedUnsubscriptionCount = 0;
  gameRestartedSubscriptionCount = 0;
  gameRestartedUnsubscriptionCount = 0;
  turnChangedSubscriptionCount = 0;
  turnChangedUnsubscriptionCount = 0;
  gameActionVoteRequestedSubscriptionCount = 0;
  gameActionVoteRequestedUnsubscriptionCount = 0;
  countryFoundSubscriptionCount = 0;
  countryFoundUnsubscriptionCount = 0;
  gameFinishedSubscriptionCount = 0;
  gameFinishedUnsubscriptionCount = 0;
  sessionToReturn: GameSession = {
    roomId: "room-1",
    playerId: "player-1",
  };

  private activeRoom = true;
  private stateChangeCallback: ((state: GameState) => void) | null = null;
  private playerJoinRoomCallback: ((event: PlayerJoinRoomEvent) => void) | null = null;
  private playerLeftRoomCallback: ((event: PlayerLeftRoomEvent) => void) | null = null;
  private gameStartedCallback: ((event: GameStartedEvent) => void) | null = null;
  private gamePausedCallback: ((event: GamePausedEvent) => void) | null = null;
  private gameResumedCallback: ((event: GameResumedEvent) => void) | null = null;
  private gameRestartedCallback: ((event: GameRestartedEvent) => void) | null = null;
  private turnChangedCallback: ((event: TurnChangedEvent) => void) | null = null;
  private countryFoundCallback: ((event: CountryFoundEvent) => void) | null = null;
  private gameActionVoteRequestedCallback:
    | ((event: GameActionVoteRequestedEvent) => void)
    | null = null;
  private gameFinishedCallback: ((event: GameFinishedEvent) => void) | null = null;

  constructor(private currentState: GameState = createGameState()) {}

  async createRoom(options: CreateRoomOptions): Promise<GameSession> {
    this.roomCreatedWith = options;
    return this.sessionToReturn;
  }

  async joinRoom(options: JoinRoomOptions): Promise<GameSession> {
    this.roomJoinedWith = options;
    return this.sessionToReturn;
  }

  async leaveRoom(): Promise<void> {
    this.leaveRoomCallCount++;
    this.activeRoom = false;
  }

  getState(): GameState {
    return this.currentState;
  }

  hasActiveRoom(): boolean {
    return this.activeRoom;
  }

  submitCountry(countryName: string): void {
    this.submittedCountries.push(countryName);
  }

  pauseGame(): void {
    this.pauseGameCallCount++;
  }

  resumeGame(): void {
    this.resumeGameCallCount++;
  }

  restartGame(): void {
    this.restartGameCallCount++;
  }

  startGame(): void {
    this.startGameCallCount++;
  }

  updateRoomSettings(options: UpdateRoomSettingsOptions): void {
    this.roomSettingsUpdatedWith = options;
  }

  voteGameAction(action: GameActionVote, requestId: string, accepted: boolean): void {
    this.voteGameActionCalls.push({
      action,
      requestId,
      accepted,
    });
  }

  onPlayerJoinRoom(callback: (event: PlayerJoinRoomEvent) => void): Unsubscribe {
    this.playerJoinRoomSubscriptionCount++;
    this.playerJoinRoomCallback = callback;

    return () => {
      this.playerJoinRoomUnsubscriptionCount++;
      this.playerJoinRoomCallback = null;
    };
  }

  onStateChange(callback: (state: GameState) => void): Unsubscribe {
    this.stateChangeSubscriptionCount++;
    this.stateChangeCallback = callback;

    return () => {
      this.stateChangeUnsubscriptionCount++;
    };
  }

  onPlayerLeftRoom(callback: (event: PlayerLeftRoomEvent) => void): Unsubscribe {
    this.playerLeftRoomSubscriptionCount++;
    this.playerLeftRoomCallback = callback;

    return () => {
      this.playerLeftRoomUnsubscriptionCount++;
      this.playerLeftRoomCallback = null;
    };
  }

  onCountryFound(callback: (event: CountryFoundEvent) => void): Unsubscribe {
    this.countryFoundSubscriptionCount++;
    this.countryFoundCallback = callback;

    return () => {
      this.countryFoundUnsubscriptionCount++;
      this.countryFoundCallback = null;
    };
  }

  onCountryRejected(): Unsubscribe {
    return () => {};
  }

  onTurnChanged(callback: (event: TurnChangedEvent) => void): Unsubscribe {
    this.turnChangedSubscriptionCount++;
    this.turnChangedCallback = callback;

    return () => {
      this.turnChangedUnsubscriptionCount++;
      this.turnChangedCallback = null;
    };
  }

  onGameStarted(callback: (event: GameStartedEvent) => void): Unsubscribe {
    this.gameStartedSubscriptionCount++;
    this.gameStartedCallback = callback;

    return () => {
      this.gameStartedUnsubscriptionCount++;
      this.gameStartedCallback = null;
    };
  }

  onGamePaused(callback: (event: GamePausedEvent) => void): Unsubscribe {
    this.gamePausedSubscriptionCount++;
    this.gamePausedCallback = callback;

    return () => {
      this.gamePausedUnsubscriptionCount++;
      this.gamePausedCallback = null;
    };
  }

  onGameResumed(callback: (event: GameResumedEvent) => void): Unsubscribe {
    this.gameResumedSubscriptionCount++;
    this.gameResumedCallback = callback;

    return () => {
      this.gameResumedUnsubscriptionCount++;
      this.gameResumedCallback = null;
    };
  }

  onGameRestarted(callback: (event: GameRestartedEvent) => void): Unsubscribe {
    this.gameRestartedSubscriptionCount++;
    this.gameRestartedCallback = callback;

    return () => {
      this.gameRestartedUnsubscriptionCount++;
      this.gameRestartedCallback = null;
    };
  }

  onGameActionVoteRequested(callback: (event: GameActionVoteRequestedEvent) => void): Unsubscribe {
    this.gameActionVoteRequestedSubscriptionCount++;
    this.gameActionVoteRequestedCallback = callback;

    return () => {
      this.gameActionVoteRequestedUnsubscriptionCount++;
      this.gameActionVoteRequestedCallback = null;
    };
  }

  onGameFinished(callback: (event: GameFinishedEvent) => void): Unsubscribe {
    this.gameFinishedSubscriptionCount++;
    this.gameFinishedCallback = callback;

    return () => {
      this.gameFinishedUnsubscriptionCount++;
      this.gameFinishedCallback = null;
    };
  }

  emitStateChange(state: GameState): void {
    this.currentState = state;
    this.stateChangeCallback?.(state);
  }

  emitPlayerJoinRoom(event: PlayerJoinRoomEvent): void {
    this.playerJoinRoomCallback?.(event);
  }

  emitPlayerLeftRoom(event: PlayerLeftRoomEvent): void {
    this.playerLeftRoomCallback?.(event);
  }

  emitGameStarted(event: GameStartedEvent): void {
    this.gameStartedCallback?.(event);
  }

  emitGamePaused(event: GamePausedEvent): void {
    this.gamePausedCallback?.(event);
  }

  emitGameResumed(event: GameResumedEvent): void {
    this.gameResumedCallback?.(event);
  }

  emitGameRestarted(event: GameRestartedEvent): void {
    this.gameRestartedCallback?.(event);
  }

  emitTurnChanged(event: TurnChangedEvent): void {
    this.turnChangedCallback?.(event);
  }

  emitCountryFound(event: CountryFoundEvent): void {
    this.countryFoundCallback?.(event);
  }

  emitGameActionVoteRequested(event: GameActionVoteRequestedEvent): void {
    this.gameActionVoteRequestedCallback?.(event);
  }

  emitGameFinished(event: GameFinishedEvent = {}): void {
    this.gameFinishedCallback?.(event);
  }
}
