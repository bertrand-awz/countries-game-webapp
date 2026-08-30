import type { FoundCountry } from "@/domain/game/models/FoundCountry.ts";
import { Player } from "@/domain/game/models/Player.ts";
import type { FoundingContinentProgressionState } from "@/domain/game/models/state/FoundingContinentProgressionState.ts";
import { GameState, GameStatus } from "@/domain/game/models/state/GameState.ts";
import type { WaitingPlayer } from "@/domain/game/models/WaitingPlayer.ts";
import type {
  AnswerValidationLanguage,
  SupportedLanguage,
} from "@/domain/shared/models/SupportedLanguage.ts";

type PlayerMotherOptions = {
  id?: string;
  username?: string;
  score?: number;
  countriesFound?: number;
  answerValidationLanguage?: AnswerValidationLanguage;
  colorSlot?: number;
};

type GameStateMotherOptions = {
  numberOfPlayers?: number;
  maxPlayersAllowed?: number;
  defaultLanguage?: SupportedLanguage;
  durationInSeconds?: number;
  turnDurationInSeconds?: number;
  startAt?: number;
  endAt?: number;
  status?: GameStatus;
  continents?: FoundingContinentProgressionState[];
  foundCountries?: FoundCountry[];
  allowAnswerValidationInPlayerCurrentLanguage?: boolean;
  players?: Player[];
  waitingPlayers?: WaitingPlayer[];
};

export function createPlayer(options: PlayerMotherOptions = {}): Player {
  const player = new Player(
    options.id ?? "player-1",
    options.username ?? "Alice",
    options.score ?? 0,
    options.answerValidationLanguage ?? "any",
    options.colorSlot ?? 0,
  );
  player.updateTotalCountriesFound(options.countriesFound ?? 0);

  return player;
}

export function createGameState(options: GameStateMotherOptions = {}): GameState {
  const players = options.players ?? [createPlayer()];

  return new GameState(
    options.numberOfPlayers ?? players.length,
    options.maxPlayersAllowed ?? 4,
    options.defaultLanguage ?? "fr",
    options.durationInSeconds ?? 300,
    options.turnDurationInSeconds ?? 45,
    options.startAt ?? 1_700_000_000,
    options.endAt ?? 1_700_000_300,
    options.status ?? GameStatus.WAITING,
    options.continents ?? [
      {
        continent: {
          id: "NORTH_AMERICA",
          countriesNumber: 23,
        },
        countriesFoundNumber: 0,
      },
    ],
    options.foundCountries ?? [],
    options.allowAnswerValidationInPlayerCurrentLanguage ?? false,
    players,
    options.waitingPlayers ?? [],
  );
}
