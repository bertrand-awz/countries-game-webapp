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
    const alice = createPlayer({ id: "player-1", username: "Alice" });
    const bob = createPlayer({ id: "player-2", username: "Bob", score: 12 });
    const gameState = createGameState({
      status: GameStatus.PLAYING,
      players: [alice, bob],
    });
    const store = useGameSessionStore();

    store.setSession({ roomId: "room-1", playerId: "player-2" });
    store.setGameState(gameState);

    assert.equal(store.isConnected, true);
    assert.equal(store.currentPlayer, bob);
    assert.equal(store.status, GameStatus.PLAYING);
    assert.deepEqual(store.players, [alice, bob]);

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
  });

  it("clears the local session and derived game context when the session ends", () => {
    const store = useGameSessionStore();
    store.setSession({ roomId: "room-1", playerId: "player-1" });
    store.setGameState(createGameState());

    store.reset();

    assert.equal(store.isConnected, false);
    assert.equal(store.currentPlayer, null);
    assert.equal(store.currentTurn, null);
    assert.equal(store.gameState, null);
    assert.deepEqual(store.players, []);
    assert.deepEqual(store.continents, []);
  });
});
