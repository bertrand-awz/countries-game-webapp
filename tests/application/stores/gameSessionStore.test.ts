import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import { createPinia, setActivePinia } from "pinia";

import { useGameSessionStore } from "@/application/stores/gameSessionStore.ts";
import { GameStatus } from "@/domain/game/models/state/GameState.ts";

import { createGameState, createPlayer } from "../../domain/game/models/state/gameStateMother.ts";

describe("gameSessionStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("connects the local session to the matching player in the current game state", () => {
    const alice = createPlayer({ id: "player-1", username: "Alice", colorSlot: 3 });
    const bob = createPlayer({ id: "player-2", username: "Bob", score: 12 });
    const gameState = createGameState({
      status: GameStatus.PLAYING,
      players: [alice, bob],
      waitingPlayers: [{ id: "player-3", username: "Grace", joinedAt: 200 }],
    });
    const store = useGameSessionStore();

    store.setSession({ roomId: "room-1", playerId: "player-2" });
    store.setGameState(gameState);

    assert.equal(store.isConnected, true);
    assert.equal(store.currentPlayer, bob);
    assert.equal(store.status, GameStatus.PLAYING);
    assert.deepEqual(store.players, [alice, bob]);
    assert.equal(store.waitingPlayers[0].username, "Grace");

    store.setCurrentTurn({
      playerId: "player-2",
      startedAt: 100,
      durationInSeconds: 45,
    });

    assert.equal(store.isCurrentPlayerTurn, true);
    assert.deepEqual(store.currentTurn, {
      playerId: "player-2",
      startedAt: 100,
      durationInSeconds: 45,
    });

    store.recordCountryFound("FRA", alice);

    assert.equal(store.highlightedCountryId, "FRA");
    assert.deepEqual(store.foundCountryIds, ["FRA"]);
    assert.deepEqual(store.foundCountries, [
      {
        countryId: "FRA",
        foundByPlayerId: "player-1",
        playerColorSlot: 3,
      },
    ]);
  });

  it("clears the local session and derived game context when the session ends", () => {
    const store = useGameSessionStore();
    store.setSession({ roomId: "room-1", playerId: "player-1" });
    store.setGameState(createGameState());
    store.highlightCountry("CAN");
    store.recordCountryFound("FRA", createPlayer({ id: "player-1", colorSlot: 2 }));

    store.reset();

    assert.equal(store.isConnected, false);
    assert.equal(store.currentPlayer, null);
    assert.equal(store.currentTurn, null);
    assert.equal(store.gameState, null);
    assert.equal(store.highlightedCountryId, null);
    assert.deepEqual(store.foundCountryIds, []);
    assert.deepEqual(store.players, []);
    assert.deepEqual(store.waitingPlayers, []);
    assert.deepEqual(store.continents, []);
  });

  it("detects when the local session is waiting for the next game", () => {
    const store = useGameSessionStore();

    store.setSession({ roomId: "room-1", playerId: "player-2" });
    store.setGameState(
      createGameState({
        players: [createPlayer({ id: "player-1", username: "Alice" })],
        waitingPlayers: [{ id: "player-2", username: "Grace", joinedAt: 200 }],
      }),
    );

    assert.equal(store.currentPlayer, null);
    assert.deepEqual(store.currentWaitingPlayer, {
      id: "player-2",
      username: "Grace",
      joinedAt: 200,
    });
  });
});
