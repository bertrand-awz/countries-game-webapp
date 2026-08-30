import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { createPinia, setActivePinia } from "pinia";

import { useGameSessionStore } from "@/application/stores/gameSessionStore.ts";
import { createRoomUseCase } from "@/application/use-cases";
import { CreateRoomUseCase } from "@/application/use-cases/createRoomUseCase.ts";
import type { CreateRoomOptions } from "@/domain/game/ports/GameServer.ts";

import { gameGatewaysFrom, overrideAppDependencies } from "../../app/appDependenciesTestHarness.ts";
import { createGameState } from "../../domain/game/models/state/gameStateMother.ts";
import { GameMapApiFake } from "../../domain/game/ports/gameMapApiFake.ts";
import { GameServerSpy } from "../../domain/game/ports/gameServerSpy.ts";
import { SoundManagerSpy } from "../../domain/game/ports/soundManagerSpy.ts";
import { NotifierSpy } from "../../domain/notification/ports/notifierSpy.ts";

describe("CreateRoomUseCase", () => {
  let restoreDependencies: () => void = () => {};

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    restoreDependencies();
  });

  it("creates a room through the game server and keeps the session store synchronized with room state changes", async () => {
    const initialState = createGameState();
    const nextState = createGameState({ durationInSeconds: 600 });
    const gameServer = new GameServerSpy(initialState);
    const options: CreateRoomOptions = {
      username: "Bertrand",
      gameLanguage: "fr",
      allowAnswerValidationInPlayerCurrentLanguage: true,
      gameDurationInSeconds: 300,
      turnDurationInSeconds: 45,
      maxPlayersAllowed: 4,
    };
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
    });

    const session = await new CreateRoomUseCase().setOptions(options).execute();
    const gameSessionStore = useGameSessionStore();

    assert.deepEqual(gameServer.roomCreatedWith, options);
    assert.deepEqual(session, gameServer.sessionToReturn);
    assert.equal(gameSessionStore.roomId, gameServer.sessionToReturn.roomId);
    assert.equal(gameSessionStore.playerId, gameServer.sessionToReturn.playerId);
    assert.equal(gameSessionStore.isConnected, true);
    assert.equal(gameSessionStore.gameState, initialState);
    assert.equal(gameServer.stateChangeSubscriptionCount, 1);

    gameServer.emitStateChange(nextState);

    assert.equal(gameSessionStore.gameState, nextState);
  });

  it("uses dependencies configured after the shared room creation use case was created", async () => {
    const gameServer = new GameServerSpy();
    const notifier = new NotifierSpy();
    const options: CreateRoomOptions = {
      username: "Bertrand",
      gameLanguage: "fr",
      allowAnswerValidationInPlayerCurrentLanguage: true,
      gameDurationInSeconds: 300,
      turnDurationInSeconds: 45,
      maxPlayersAllowed: 4,
    };
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
      notifier,
    });

    await createRoomUseCase.setOptions(options).execute();
    gameServer.emitPlayerJoinRoom({
      playerId: "player-2",
      username: "Grace",
      numberOfPlayers: 2,
    });

    assert.deepEqual(gameServer.roomCreatedWith, options);
    assert.deepEqual(notifier.notifications, [
      {
        variant: "success",
        title: {
          translationKey: "GAME.NOTIFICATIONS.PLAYER_JOINED.TITLE",
        },
        message: {
          translationKey: "GAME.NOTIFICATIONS.PLAYER_JOINED.MESSAGE",
          values: {
            username: "Grace",
            numberOfPlayers: 2,
          },
        },
        durationMs: 5000,
      },
    ]);
  });

  it("refuses to create a room when the creation intent is incomplete", async () => {
    const gameServer = new GameServerSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
    });

    await assert.rejects(
      async () => new CreateRoomUseCase().execute(),
      /Room creation options are required\./,
    );

    assert.equal(gameServer.roomCreatedWith, null);
  });
});
