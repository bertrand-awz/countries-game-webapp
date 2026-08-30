import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { StartGameUseCase } from "@/application/use-cases/game-commands/startGameUseCase.ts";

import {
  gameGatewaysFrom,
  overrideAppDependencies,
} from "../../../app/appDependenciesTestHarness.ts";
import { GameMapApiFake } from "../../../domain/game/ports/gameMapApiFake.ts";
import { GameServerSpy } from "../../../domain/game/ports/gameServerSpy.ts";
import { SoundManagerSpy } from "../../../domain/game/ports/soundManagerSpy.ts";

describe("StartGameUseCase", () => {
  let restoreDependencies: () => void = () => {};

  afterEach(() => {
    restoreDependencies();
  });

  it("delegates the start command to the active game server", () => {
    const gameServer = new GameServerSpy();
    const soundManager = new SoundManagerSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager,
      gameMapApi: new GameMapApiFake(),
    });

    new StartGameUseCase().execute();

    assert.equal(gameServer.startGameCallCount, 1);
    assert.equal(soundManager.mainThemePlayCount, 1);
  });
});
