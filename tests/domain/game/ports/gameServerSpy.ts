import type { GameFinishedEvent } from "@/domain/game/events/GameFinishedEvent.ts";
import type { GameState } from "@/domain/game/models/state/GameState.ts";
import type {
  CreateRoomOptions,
  GameCommandGateway,
  GameEventGateway,
  GameRoomGateway,
  GameSession,
  JoinRoomOptions,
  Unsubscribe,
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
  stateChangeSubscriptionCount = 0;
  stateChangeUnsubscriptionCount = 0;
  gameFinishedSubscriptionCount = 0;
  gameFinishedUnsubscriptionCount = 0;
  sessionToReturn: GameSession = {
    roomId: "room-1",
    playerId: "player-1",
  };

  private activeRoom = true;
  private stateChangeCallback: ((state: GameState) => void) | null = null;
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

  onPlayerJoinRoom(): Unsubscribe {
    return () => {};
  }

  onStateChange(callback: (state: GameState) => void): Unsubscribe {
    this.stateChangeSubscriptionCount++;
    this.stateChangeCallback = callback;

    return () => {
      this.stateChangeUnsubscriptionCount++;
    };
  }

  onCountryFound(): Unsubscribe {
    return () => {};
  }

  onCountryRejected(): Unsubscribe {
    return () => {};
  }

  onTurnChanged(): Unsubscribe {
    return () => {};
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

  emitGameFinished(event: GameFinishedEvent = {}): void {
    this.gameFinishedCallback?.(event);
  }
}
