import type { GameState } from "@/domain/game/models/state/GameState.ts";
import type {
  CreateRoomOptions,
  GameServer,
  GameSession,
  JoinRoomOptions,
} from "@/domain/game/ports/GameServer.ts";

import { createGameState } from "../models/state/gameStateMother.ts";

export class GameServerSpy implements GameServer {
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
  sessionToReturn: GameSession = {
    roomId: "room-1",
    playerId: "player-1",
  };

  private activeRoom = true;
  private stateChangeCallback: ((state: GameState) => void) | null = null;

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

  onPlayerJoinRoom(): void {}

  onStateChange(callback: (state: GameState) => void): () => void {
    this.stateChangeSubscriptionCount++;
    this.stateChangeCallback = callback;

    return () => {
      this.stateChangeUnsubscriptionCount++;
    };
  }

  onCountryFound(): void {}

  onCountryRejected(): void {}

  onTurnChanged(): void {}

  emitStateChange(state: GameState): void {
    this.currentState = state;
    this.stateChangeCallback?.(state);
  }
}
