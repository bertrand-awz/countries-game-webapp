import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { SubmitAnswerUseCase } from "@/application/use-cases/game-commands/submitAnswerUseCase.ts";

import {
  gameGatewaysFrom,
  overrideAppDependencies,
} from "../../../app/appDependenciesTestHarness.ts";
import { GameMapApiFake } from "../../../domain/game/ports/gameMapApiFake.ts";
import { GameServerSpy } from "../../../domain/game/ports/gameServerSpy.ts";
import { SoundManagerSpy } from "../../../domain/game/ports/soundManagerSpy.ts";

describe("SubmitAnswerUseCase", () => {
  let restoreDependencies: () => void = () => {};

  afterEach(() => {
    restoreDependencies();
  });

  it("submits the player's country answer through the game server command port", () => {
    const gameServer = new GameServerSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
    });

    new SubmitAnswerUseCase().setOptions({ countryName: "Canada" }).execute();

    assert.deepEqual(gameServer.submittedCountries, ["Canada"]);
  });
});
