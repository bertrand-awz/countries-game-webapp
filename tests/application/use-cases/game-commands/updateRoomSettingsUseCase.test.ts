import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { UpdateRoomSettingsUseCase } from "@/application/use-cases/game-commands/updateRoomSettingsUseCase.ts";

import {
  gameGatewaysFrom,
  overrideAppDependencies,
} from "../../../app/appDependenciesTestHarness.ts";
import { GameMapApiFake } from "../../../domain/game/ports/gameMapApiFake.ts";
import { GameServerSpy } from "../../../domain/game/ports/gameServerSpy.ts";
import { SoundManagerSpy } from "../../../domain/game/ports/soundManagerSpy.ts";

describe("UpdateRoomSettingsUseCase", () => {
  let restoreDependencies: () => void = () => {};

  afterEach(() => {
    restoreDependencies();
  });

  it("updates room settings through the game server command gateway", () => {
    const gameServer = new GameServerSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
    });

    new UpdateRoomSettingsUseCase()
      .setOptions({
        numPlayers: 4,
        durationInMinutes: 3,
        turnDurationInSeconds: 45,
      })
      .execute();

    assert.deepEqual(gameServer.roomSettingsUpdatedWith, {
      maxPlayersAllowed: 4,
      gameDurationInSeconds: 180,
      turnDurationInSeconds: 45,
    });
  });

  it("refuses to update room settings without settings", () => {
    const gameServer = new GameServerSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
    });

    assert.throws(() => new UpdateRoomSettingsUseCase().execute(), /Room settings are required\./);
    assert.equal(gameServer.roomSettingsUpdatedWith, null);
  });
});
