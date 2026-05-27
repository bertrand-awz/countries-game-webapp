import type { Player } from "@/domain/game/models/Player";
import type { FoundingContinentProgressionState } from "@/domain/game/models/state/FoundingContinentProgressionState";
import { GameState, GameStatus } from "@/domain/game/models/state/GameState.ts";
import type { SupportedLanguage } from "@/domain/shared/models/SupportedLanguage.ts";

export class GameStateMapper {
  static fromColyseusState(colyseusGameState: {
    numberOfPlayers: number;
    defaultLanguage: SupportedLanguage;
    durationInSeconds: number;
    startAt: number;
    endAt: number;
    status: GameStatus;
    continents: FoundingContinentProgressionState[];
    allowAnswerValidationInPlayerLanguage: boolean;
    players: Player[];
  }): GameState {
    return new GameState(
      colyseusGameState.numberOfPlayers,
      colyseusGameState.defaultLanguage,
      colyseusGameState.durationInSeconds,
      colyseusGameState.startAt,
      colyseusGameState.endAt,
      colyseusGameState.status,
      colyseusGameState.continents,
      colyseusGameState.allowAnswerValidationInPlayerLanguage,
      colyseusGameState.players,
    );
  }
}
