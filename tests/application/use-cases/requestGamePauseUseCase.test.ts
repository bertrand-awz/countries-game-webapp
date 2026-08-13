import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { RequestGamePauseUseCase } from "@/application/use-cases/requestGamePauseUseCase.ts";

import { overrideAppDependencies } from "../../app/appDependenciesTestHarness.ts";
import { GameMapApiFake } from "../../domain/game/ports/gameMapApiFake.ts";
import { GameServerSpy } from "../../domain/game/ports/gameServerSpy.ts";
import { SoundManagerSpy } from "../../domain/game/ports/soundManagerSpy.ts";

describe("RequestGamePauseUseCase", () => {
  let restoreDependencies: () => void = () => {};

  afterEach(() => {
    restoreDependencies();
  });

  it("asks the game server to pause the active game", () => {
    const gameServer = new GameServerSpy();
    restoreDependencies = overrideAppDependencies({
      gameServer,
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
    });

    new RequestGamePauseUseCase().execute();

    assert.equal(gameServer.pauseGameCallCount, 1);
  });
});
