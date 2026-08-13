import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { StartGameUseCase } from "@/application/use-cases/startGameUseCase.ts";

import { overrideAppDependencies } from "../../app/appDependenciesTestHarness.ts";
import { GameMapApiFake } from "../../domain/game/ports/gameMapApiFake.ts";
import { GameServerSpy } from "../../domain/game/ports/gameServerSpy.ts";
import { SoundManagerSpy } from "../../domain/game/ports/soundManagerSpy.ts";

describe("StartGameUseCase", () => {
  let restoreDependencies: () => void = () => {};

  afterEach(() => {
    restoreDependencies();
  });

  it("delegates the start command to the active game server", () => {
    const gameServer = new GameServerSpy();
    restoreDependencies = overrideAppDependencies({
      gameServer,
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
    });

    new StartGameUseCase().execute();

    assert.equal(gameServer.startGameCallCount, 1);
  });
});
