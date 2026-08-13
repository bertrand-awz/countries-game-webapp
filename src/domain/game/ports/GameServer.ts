import type { CountryFoundEvent } from "@/domain/game/events/CountryFoundEvent.ts";
import type { CountryRejectedEvent } from "@/domain/game/events/CountryRejectedEvent.ts";
import type { PlayerJoinRoomEvent } from "@/domain/game/events/PlayerJoinRoomEvent.ts";
import type { TurnChangedEvent } from "@/domain/game/events/TurnChangedEvent.ts";
import type { GameState } from "@/domain/game/models/state/GameState.ts";

export type GameSession = {
  roomId: string;
  playerId: string;
};

export type CreateRoomOptions = {
  username: string;
  gameLanguage: string;
  gameDurationInSeconds: number;
  maxPlayersAllowed: number;
};

export type JoinRoomOptions = {
  username: string;
  roomId: string;
};

export interface GameRoomGateway {
  createRoom(options: CreateRoomOptions): Promise<GameSession>;
  joinRoom(options: JoinRoomOptions): Promise<GameSession>;
  leaveRoom(): Promise<void>;
  getState(): GameState;
}

export interface GameCommandGateway {
  submitCountry(countryName: string): void;
  pauseGame(): void;
  resumeGame(): void;
  restartGame(): void;
  startGame(): void;
}

export interface GameEventGateway {
  onPlayerJoinRoom(callback: (event: PlayerJoinRoomEvent) => void): void;
  onStateChange(callback: (state: GameState) => void): () => void;
  onCountryFound(callback: (event: CountryFoundEvent) => void): void;
  onCountryRejected(callback: (event: CountryRejectedEvent) => void): void;
  onTurnChanged(callback: (event: TurnChangedEvent) => void): void;
}

export interface GameServer extends GameCommandGateway, GameEventGateway, GameRoomGateway {
   hasActiveRoom(): boolean;
}
