import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { RegisterGameEventReactionsUseCase } from "@/application/use-cases/registerGameEventReactionsUseCase.ts";

import { gameGatewaysFrom, overrideAppDependencies } from "../../app/appDependenciesTestHarness.ts";
import { GameMapApiFake } from "../../domain/game/ports/gameMapApiFake.ts";
import { GameServerSpy } from "../../domain/game/ports/gameServerSpy.ts";
import { SoundManagerSpy } from "../../domain/game/ports/soundManagerSpy.ts";
import { NotifierSpy } from "../../domain/notification/ports/notifierSpy.ts";

describe("RegisterGameEventReactionsUseCase", () => {
  let restoreDependencies: () => void = () => {};

  afterEach(() => {
    restoreDependencies();
  });

  it("notifies the frontend when the server announces that the game finished", () => {
    const gameServer = new GameServerSpy();
    const notifier = new NotifierSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
      notifier,
    });

    new RegisterGameEventReactionsUseCase().execute();
    gameServer.emitGameFinished();

    assert.equal(gameServer.gameFinishedSubscriptionCount, 1);
    assert.deepEqual(notifier.notifications, [
      {
        variant: "game-finished",
        title: {
          translationKey: "GAME.NOTIFICATIONS.GAME_FINISHED.TITLE",
        },
        message: {
          translationKey: "GAME.NOTIFICATIONS.GAME_FINISHED.MESSAGE",
        },
        durationMs: 5000,
      },
    ]);
  });

  it("clears previous reaction subscriptions before registering new ones", () => {
    const gameServer = new GameServerSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
      notifier: new NotifierSpy(),
    });
    const useCase = new RegisterGameEventReactionsUseCase();

    useCase.execute();
    useCase.execute();

    assert.equal(gameServer.gameFinishedSubscriptionCount, 2);
    assert.equal(gameServer.gameFinishedUnsubscriptionCount, 1);
  });
});
