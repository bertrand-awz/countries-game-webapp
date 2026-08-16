import type { Player } from "@/domain/game/models/Player.ts";
import type { FoundingContinentProgressionState } from "@/domain/game/models/state/FoundingContinentProgressionState.ts";
import type { SupportedLanguage } from "@/domain/shared/models/SupportedLanguage.ts";

export enum GameStatus {
  WAITING = "waiting",
  PLAYING = "playing",
  PAUSED = "paused",
  FINISHED = "finished",
}

export class GameState {
  constructor(
    readonly numberOfPlayers: number,
    readonly defaultLanguage: SupportedLanguage,
    readonly durationInSeconds: number,
    readonly turnDurationInSeconds: number,
    readonly startAt: number,
    readonly endAt: number,
    readonly status: GameStatus,
    readonly continents: FoundingContinentProgressionState[],
    readonly allowAnswerValidationInPlayerCurrentLanguage: boolean,
    readonly players: Player[],
  ) {}
}
