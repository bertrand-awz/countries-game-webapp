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
import type { GameState } from "@/domain/game/models/state/GameState.ts";

export type Unsubscribe = () => void;

export type GameSession = {
  roomId: string;
  playerId: string;
};

export type CreateRoomOptions = {
  username: string;
  gameLanguage: string;
  gameDurationInSeconds: number;
  turnDurationInSeconds: number;
  maxPlayersAllowed: number;
};

export type JoinRoomOptions = {
  username: string;
  roomId: string;
};

export type UpdateRoomSettingsOptions = {
  gameDurationInSeconds: number;
  turnDurationInSeconds: number;
  maxPlayersAllowed: number;
};

export interface GameRoomGateway {
  createRoom(options: CreateRoomOptions): Promise<GameSession>;
  joinRoom(options: JoinRoomOptions): Promise<GameSession>;
  leaveRoom(): Promise<void>;
  getState(): GameState;
  hasActiveRoom(): boolean;
}

export interface GameCommandGateway {
  submitCountry(countryName: string): void;
  pauseGame(): void;
  resumeGame(): void;
  restartGame(): void;
  startGame(): void;
  updateRoomSettings(options: UpdateRoomSettingsOptions): void;
  voteGameAction(action: GameActionVote, requestId: string, accepted: boolean): void;
}

export interface GameEventGateway {
  onPlayerJoinRoom(callback: (event: PlayerJoinRoomEvent) => void): Unsubscribe;
  onPlayerLeftRoom(callback: (event: PlayerLeftRoomEvent) => void): Unsubscribe;
  onStateChange(callback: (state: GameState) => void): Unsubscribe;
  onCountryFound(callback: (event: CountryFoundEvent) => void): Unsubscribe;
  onCountryRejected(callback: (event: CountryRejectedEvent) => void): Unsubscribe;
  onTurnChanged(callback: (event: TurnChangedEvent) => void): Unsubscribe;
  onGameStarted(callback: (event: GameStartedEvent) => void): Unsubscribe;
  onGamePaused(callback: (event: GamePausedEvent) => void): Unsubscribe;
  onGameResumed(callback: (event: GameResumedEvent) => void): Unsubscribe;
  onGameRestarted(callback: (event: GameRestartedEvent) => void): Unsubscribe;
  onGameActionVoteRequested(callback: (event: GameActionVoteRequestedEvent) => void): Unsubscribe;
  onGameFinished(callback: (event: GameFinishedEvent) => void): Unsubscribe;
}
