import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { RequestGameResumeUseCase } from "@/application/use-cases/requestGameResumeUseCase.ts";

import { overrideAppDependencies } from "../../app/appDependenciesTestHarness.ts";
import { GameMapApiFake } from "../../domain/game/ports/gameMapApiFake.ts";
import { GameServerSpy } from "../../domain/game/ports/gameServerSpy.ts";
import { SoundManagerSpy } from "../../domain/game/ports/soundManagerSpy.ts";

describe("RequestGameResumeUseCase", () => {
  let restoreDependencies: () => void = () => {};

  afterEach(() => {
    restoreDependencies();
  });

  it("asks the game server to resume the active game", () => {
    const gameServer = new GameServerSpy();
    restoreDependencies = overrideAppDependencies({
      gameServer,
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
    });

    new RequestGameResumeUseCase().execute();

    assert.equal(gameServer.resumeGameCallCount, 1);
  });
});
