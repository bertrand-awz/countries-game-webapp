import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { UpdateAnswerValidationLanguageUseCase } from "@/application/use-cases/game-commands/updateAnswerValidationLanguageUseCase.ts";

import {
  gameGatewaysFrom,
  overrideAppDependencies,
} from "../../../app/appDependenciesTestHarness.ts";
import { GameMapApiFake } from "../../../domain/game/ports/gameMapApiFake.ts";
import { GameServerSpy } from "../../../domain/game/ports/gameServerSpy.ts";
import { SoundManagerSpy } from "../../../domain/game/ports/soundManagerSpy.ts";

describe("UpdateAnswerValidationLanguageUseCase", () => {
  let restoreDependencies: () => void = () => {};

  afterEach(() => {
    restoreDependencies();
  });

  it("updates the current player's answer validation language through the game server command gateway", () => {
    const gameServer = new GameServerSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
    });

    new UpdateAnswerValidationLanguageUseCase().setOptions({ language: "any" }).execute();

    assert.equal(gameServer.answerValidationLanguageUpdatedWith, "any");
  });

  it("refuses to update the answer validation language without a language", () => {
    const gameServer = new GameServerSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
    });

    assert.throws(
      () => new UpdateAnswerValidationLanguageUseCase().execute(),
      /Answer validation language is required\./,
    );
    assert.equal(gameServer.answerValidationLanguageUpdatedWith, null);
  });
});
