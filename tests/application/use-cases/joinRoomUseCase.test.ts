import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { createPinia, setActivePinia } from "pinia";

import { useGameSessionStore } from "@/application/stores/gameSessionStore.ts";
import { JoinRoomUseCase } from "@/application/use-cases/joinRoomUseCase.ts";
import type { JoinRoomOptions } from "@/domain/game/ports/GameServer.ts";

import { overrideAppDependencies } from "../../app/appDependenciesTestHarness.ts";
import { createGameState } from "../../domain/game/models/state/gameStateMother.ts";
import { GameMapApiFake } from "../../domain/game/ports/gameMapApiFake.ts";
import { GameServerSpy } from "../../domain/game/ports/gameServerSpy.ts";
import { SoundManagerSpy } from "../../domain/game/ports/soundManagerSpy.ts";

describe("JoinRoomUseCase", () => {
  let restoreDependencies: () => void = () => {};

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    restoreDependencies();
  });

  it("joins the requested room and attaches the local session to subsequent game state changes", async () => {
    const initialState = createGameState();
    const nextState = createGameState({ durationInSeconds: 900 });
    const gameServer = new GameServerSpy(initialState);
    const options: JoinRoomOptions = {
      username: "Ada",
      roomId: "room-42",
    };
    restoreDependencies = overrideAppDependencies({
      gameServer,
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
    });

    const session = await new JoinRoomUseCase().setOptions(options).execute();
    const gameSessionStore = useGameSessionStore();

    assert.deepEqual(gameServer.roomJoinedWith, options);
    assert.deepEqual(session, gameServer.sessionToReturn);
    assert.equal(gameSessionStore.roomId, gameServer.sessionToReturn.roomId);
    assert.equal(gameSessionStore.playerId, gameServer.sessionToReturn.playerId);
    assert.equal(gameSessionStore.gameState, initialState);

    gameServer.emitStateChange(nextState);

    assert.equal(gameSessionStore.gameState, nextState);
  });

  it("refuses to join a room without a complete joining intent", async () => {
    const gameServer = new GameServerSpy();
    restoreDependencies = overrideAppDependencies({
      gameServer,
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
    });

    await assert.rejects(
      async () => new JoinRoomUseCase().execute(),
      /Room joining options are required\./,
    );

    assert.equal(gameServer.roomJoinedWith, null);
  });
});
