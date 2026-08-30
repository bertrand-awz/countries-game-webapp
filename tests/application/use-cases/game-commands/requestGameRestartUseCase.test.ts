import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { RequestGameRestartUseCase } from "@/application/use-cases/game-commands/requestGameRestartUseCase.ts";

import {
  gameGatewaysFrom,
  overrideAppDependencies,
} from "../../../app/appDependenciesTestHarness.ts";
import { GameMapApiFake } from "../../../domain/game/ports/gameMapApiFake.ts";
import { GameServerSpy } from "../../../domain/game/ports/gameServerSpy.ts";
import { SoundManagerSpy } from "../../../domain/game/ports/soundManagerSpy.ts";

describe("RequestGameRestartUseCase", () => {
  let restoreDependencies: () => void = () => {};

  afterEach(() => {
    restoreDependencies();
  });

  it("asks the game server to restart the active game", () => {
    const gameServer = new GameServerSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
    });

    new RequestGameRestartUseCase().execute();

    assert.equal(gameServer.restartGameCallCount, 1);
  });
});
