import type { Continent } from "@/domain/game/models/Continent.ts";
import { Player } from "@/domain/game/models/Player.ts";
import type { FoundingContinentProgressionState } from "@/domain/game/models/state/FoundingContinentProgressionState.ts";
import { GameState, GameStatus } from "@/domain/game/models/state/GameState.ts";
import type { WaitingPlayer } from "@/domain/game/models/WaitingPlayer.ts";
import type { SupportedLanguage } from "@/domain/shared/models/SupportedLanguage.ts";

type ColyseusPlayerState = {
  id: string;
  username: string;
  score: number;
  totalCountriesFound: number;
};

type ColyseusWaitingPlayerState = {
  id: string;
  username: string;
  joinedAt: number;
};

type ColyseusContinentProgressState = {
  continent: Continent;
  countriesFoundNumber: number;
};

type ColyseusGameState = {
  numberOfPlayers: number;
  maxPlayersAllowed?: number;
  defaultLanguage: SupportedLanguage;
  durationInSeconds: number;
  turnDurationInSeconds: number;
  startAt: number;
  endAt: number;
  status: GameStatus;
  continents: Iterable<ColyseusContinentProgressState>;
  allowAnswerValidationInPlayerCurrentLanguage: boolean;
  players: Iterable<ColyseusPlayerState>;
  waitingPlayers?: Iterable<ColyseusWaitingPlayerState>;
};

export class GameStateMapper {
  static fromColyseusState(colyseusGameState: unknown): GameState {
    const state = colyseusGameState as ColyseusGameState;

    return new GameState(
      state.numberOfPlayers,
      state.maxPlayersAllowed ?? state.numberOfPlayers,
      state.defaultLanguage,
      state.durationInSeconds,
      state.turnDurationInSeconds,
      state.startAt,
      state.endAt,
      state.status,
      this.mapContinents(state.continents),
      state.allowAnswerValidationInPlayerCurrentLanguage,
      this.mapPlayers(state.players),
      this.mapWaitingPlayers(state.waitingPlayers),
    );
  }

  private static mapPlayers(colyseusPlayers: Iterable<ColyseusPlayerState>): Player[] {
    return Array.from(colyseusPlayers, (colyseusPlayer) => {
      const player = new Player(colyseusPlayer.id, colyseusPlayer.username, colyseusPlayer.score);
      player.updateTotalCountriesFound(colyseusPlayer.totalCountriesFound);

      return player;
    });
  }

  private static mapContinents(
    colyseusContinents: Iterable<ColyseusContinentProgressState>,
  ): FoundingContinentProgressionState[] {
    return Array.from(colyseusContinents, (progression) => ({
      continent: {
        id: progression.continent.id,
        countriesNumber: progression.continent.countriesNumber,
      },
      countriesFoundNumber: progression.countriesFoundNumber,
    }));
  }

  private static mapWaitingPlayers(
    colyseusWaitingPlayers: Iterable<ColyseusWaitingPlayerState> | undefined,
  ): WaitingPlayer[] {
    return Array.from(colyseusWaitingPlayers ?? [], (waitingPlayer) => ({
      id: waitingPlayer.id,
      username: waitingPlayer.username,
      joinedAt: waitingPlayer.joinedAt,
    }));
  }
}
