import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { createPinia, setActivePinia } from "pinia";

import { useGameSessionStore } from "@/application/stores/gameSessionStore.ts";
import { LeaveRoomUseCase } from "@/application/use-cases/leaveRoomUseCase.ts";

import { gameGatewaysFrom, overrideAppDependencies } from "../../app/appDependenciesTestHarness.ts";
import { createGameState } from "../../domain/game/models/state/gameStateMother.ts";
import { GameMapApiFake } from "../../domain/game/ports/gameMapApiFake.ts";
import { GameServerSpy } from "../../domain/game/ports/gameServerSpy.ts";
import { SoundManagerSpy } from "../../domain/game/ports/soundManagerSpy.ts";
import { NotifierSpy } from "../../domain/notification/ports/notifierSpy.ts";

class GameEventReactionsRegistrySpy {
  clearSubscriptionsCallCount = 0;

  clearSubscriptions(): void {
    this.clearSubscriptionsCallCount++;
  }
}

describe("LeaveRoomUseCase", () => {
  let restoreDependencies: () => void = () => {};

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    restoreDependencies();
  });

  it("leaves the active room and clears the local game session", async () => {
    const gameServer = new GameServerSpy();
    const notifier = new NotifierSpy();
    const gameEventReactionsRegistry = new GameEventReactionsRegistrySpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
      notifier,
    });
    const gameSessionStore = useGameSessionStore();
    gameSessionStore.setSession({ roomId: "room-1", playerId: "player-1" });
    gameSessionStore.setGameState(createGameState());

    await new LeaveRoomUseCase(gameEventReactionsRegistry).execute();

    assert.equal(gameServer.leaveRoomCallCount, 1);
    assert.equal(gameServer.hasActiveRoom(), false);
    assert.equal(gameEventReactionsRegistry.clearSubscriptionsCallCount, 1);
    assert.deepEqual(notifier.dismissedNotificationIds, ["current-turn"]);
    assert.equal(gameSessionStore.isConnected, false);
    assert.equal(gameSessionStore.roomId, null);
    assert.equal(gameSessionStore.playerId, null);
    assert.equal(gameSessionStore.gameState, null);
  });
});
