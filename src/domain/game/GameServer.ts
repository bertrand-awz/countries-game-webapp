import type { CountryFoundEvent } from "@/domain/game/events/CountryFoundEvent";
import type { CountryRejectedEvent } from "@/domain/game/events/CountryRejectedEvent";
import type { TurnChangedEvent } from "@/domain/game/events/TurnChangedEvent";

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

export interface GameServer {
  createRoom(options: CreateRoomOptions): Promise<GameSession>;

  joinRoom(options: JoinRoomOptions): Promise<GameSession>;

  joinOrCreateRoom(options: CreateRoomOptions & { username: string }): Promise<GameSession>;

  leaveRoom(): Promise<void>;

  submitCountry(countryName: string): void;

  pauseGame(): void;

  resumeGame(): void;

  restartGame(): void;

  onStateChange(callback: (state: GameState) => void): void;

  onCountryFound(callback: (event: CountryFoundEvent) => void): void;

  onCountryRejected(callback: (event: CountryRejectedEvent) => void): void;

  onTurnChanged(callback: (event: TurnChangedEvent) => void): void;
}
