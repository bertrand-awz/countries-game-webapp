import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { SynchronizeCountdownSoundUseCase } from "@/application/use-cases/game-sound/synchronizeCountdownSoundUseCase.ts";
import { GameStatus } from "@/domain/game/models/state/GameState.ts";
import { LoopableSoundEffectName } from "@/domain/game/ports/SoundManager.ts";

import {
  gameGatewaysFrom,
  overrideAppDependencies,
} from "../../../app/appDependenciesTestHarness.ts";
import { GameMapApiFake } from "../../../domain/game/ports/gameMapApiFake.ts";
import { GameServerSpy } from "../../../domain/game/ports/gameServerSpy.ts";
import { SoundManagerSpy } from "../../../domain/game/ports/soundManagerSpy.ts";

describe("SynchronizeCountdownSoundUseCase", () => {
  let restoreDependencies: () => void = () => {};

  afterEach(() => {
    restoreDependencies();
  });

  it("plays the countdown loop at 25 percent of the room duration and stops it when the game ends", () => {
    const gameServer = new GameServerSpy();
    const soundManager = new SoundManagerSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager,
      gameMapApi: new GameMapApiFake(),
    });
    const useCase = new SynchronizeCountdownSoundUseCase();

    useCase
      .setOptions({
        gameStatus: GameStatus.PLAYING,
        timeLeftInSeconds: 151,
        totalDurationInSeconds: 600,
      })
      .execute();

    assert.deepEqual(soundManager.loopedEffects, []);

    useCase
      .setOptions({
        gameStatus: GameStatus.PLAYING,
        timeLeftInSeconds: 150,
        totalDurationInSeconds: 600,
      })
      .execute();
    useCase
      .setOptions({
        gameStatus: GameStatus.PLAYING,
        timeLeftInSeconds: 149,
        totalDurationInSeconds: 600,
      })
      .execute();

    assert.deepEqual(soundManager.loopedEffects, [LoopableSoundEffectName.TIMER_COUNTDOWN]);

    useCase
      .setOptions({
        gameStatus: GameStatus.FINISHED,
        timeLeftInSeconds: 0,
        totalDurationInSeconds: 600,
      })
      .execute();
    useCase.stop();

    assert.deepEqual(soundManager.stoppedLoopableEffects, [
      LoopableSoundEffectName.TIMER_COUNTDOWN,
    ]);
  });

  it("does not play the countdown loop when local sound effects are disabled", () => {
    const gameServer = new GameServerSpy();
    const soundManager = new SoundManagerSpy();
    soundManager.setSoundEffectsEnabled(false);
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager,
      gameMapApi: new GameMapApiFake(),
    });

    new SynchronizeCountdownSoundUseCase()
      .setOptions({
        gameStatus: GameStatus.PLAYING,
        timeLeftInSeconds: 15,
        totalDurationInSeconds: 60,
      })
      .execute();

    assert.deepEqual(soundManager.loopedEffects, []);
  });
});
