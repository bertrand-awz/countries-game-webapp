import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { Player } from "@/domain/game/models/Player.ts";
import { GameStatus } from "@/domain/game/models/state/GameState.ts";
import { GameStateMapper } from "@/infrastructure/game-server/colyseus/mappers/GameStateMapper.ts";

describe("GameStateMapper", () => {
  it("translates a Colyseus state snapshot into domain entities used by the game session", () => {
    const colyseusPlayer = {
      id: "player-1",
      username: "Ada",
      score: 18,
      totalCountriesFound: 3,
      answerValidationLanguage: "ja",
      colorSlot: 6,
    };
    const colyseusState = {
      numberOfPlayers: 2,
      maxPlayersAllowed: 4,
      defaultLanguage: "en",
      durationInSeconds: 600,
      turnDurationInSeconds: 45,
      startAt: 100,
      endAt: 700,
      status: GameStatus.PLAYING,
      continents: [
        {
          continent: {
            id: "EUROPE",
            countriesNumber: 44,
          },
          countriesFoundNumber: 5,
        },
      ],
      foundCountries: [
        {
          countryId: "CAN",
          foundByPlayerId: "player-1",
          playerColorSlot: 6,
        },
      ],
      allowAnswerValidationInPlayerCurrentLanguage: true,
      players: [colyseusPlayer],
      waitingPlayers: [{ id: "player-2", username: "Grace", joinedAt: 300 }],
    };

    const gameState = GameStateMapper.fromColyseusState(colyseusState);

    assert.equal(gameState.numberOfPlayers, 2);
    assert.equal(gameState.maxPlayersAllowed, 4);
    assert.equal(gameState.defaultLanguage, "en");
    assert.equal(gameState.turnDurationInSeconds, 45);
    assert.equal(gameState.status, GameStatus.PLAYING);
    assert.equal(gameState.allowAnswerValidationInPlayerCurrentLanguage, true);
    assert.deepEqual(gameState.continents, [
      {
        continent: {
          id: "EUROPE",
          countriesNumber: 44,
        },
        countriesFoundNumber: 5,
      },
    ]);
    assert.deepEqual(gameState.foundCountries, [
      {
        countryId: "CAN",
        foundByPlayerId: "player-1",
        playerColorSlot: 6,
      },
    ]);
    assert.equal(gameState.players.length, 1);
    assert.equal(gameState.players[0] instanceof Player, true);
    assert.equal(gameState.players[0].getId(), "player-1");
    assert.equal(gameState.players[0].getUsername(), "Ada");
    assert.equal(gameState.players[0].getScore(), 18);
    assert.equal(gameState.players[0].getCountriesFoundNumber(), 3);
    assert.equal(gameState.players[0].getAnswerValidationLanguage(), "ja");
    assert.equal(gameState.players[0].getColorSlot(), 6);
    assert.deepEqual(gameState.waitingPlayers, [
      {
        id: "player-2",
        username: "Grace",
        joinedAt: 300,
      },
    ]);
  });
});
