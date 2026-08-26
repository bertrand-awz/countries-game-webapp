import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { createPinia, setActivePinia } from "pinia";

import { useGameSessionStore } from "@/application/stores/gameSessionStore.ts";
import { RegisterGameEventReactionsUseCase } from "@/application/use-cases/registerGameEventReactionsUseCase.ts";
import { GameStatus } from "@/domain/game/models/state/GameState.ts";
import { SoundEffectName } from "@/domain/game/ports/SoundManager.ts";

import { gameGatewaysFrom, overrideAppDependencies } from "../../app/appDependenciesTestHarness.ts";
import { createGameState, createPlayer } from "../../domain/game/models/state/gameStateMother.ts";
import { GameMapApiFake } from "../../domain/game/ports/gameMapApiFake.ts";
import { GameServerSpy } from "../../domain/game/ports/gameServerSpy.ts";
import { SoundManagerSpy } from "../../domain/game/ports/soundManagerSpy.ts";
import { NotifierSpy } from "../../domain/notification/ports/notifierSpy.ts";

describe("RegisterGameEventReactionsUseCase", () => {
  let restoreDependencies: () => void = () => {};

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    restoreDependencies();
  });

  it("notifies the frontend when room lifecycle events happen", () => {
    const alice = createPlayer({ id: "player-1", username: "Alice" });
    const grace = createPlayer({ id: "player-2", username: "Grace" });
    const gameServer = new GameServerSpy(createGameState({ players: [alice, grace] }));
    const notifier = new NotifierSpy();
    const soundManager = new SoundManagerSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager,
      gameMapApi: new GameMapApiFake(),
      notifier,
    });
    useGameSessionStore().setGameState(gameServer.getState());

    new RegisterGameEventReactionsUseCase().execute();
    gameServer.emitPlayerJoinRoom({
      playerId: "player-2",
      username: "Grace",
      numberOfPlayers: 2,
    });
    gameServer.emitPlayerLeftRoom({
      playerId: "player-2",
      username: "Grace",
      numberOfPlayers: 1,
    });
    gameServer.emitGameStarted({
      startAt: 10,
      endAt: 310,
      durationInSeconds: 300,
      startedByPlayerId: "player-2",
      currentPlayerId: "player-1",
    });

    assert.deepEqual(notifier.notifications, [
      {
        variant: "success",
        title: {
          translationKey: "GAME.NOTIFICATIONS.PLAYER_JOINED.TITLE",
        },
        message: {
          translationKey: "GAME.NOTIFICATIONS.PLAYER_JOINED.MESSAGE",
          values: {
            username: "Grace",
            numberOfPlayers: 2,
          },
        },
        durationMs: 5000,
      },
      {
        variant: "warning",
        title: {
          translationKey: "GAME.NOTIFICATIONS.PLAYER_LEFT.TITLE",
        },
        message: {
          translationKey: "GAME.NOTIFICATIONS.PLAYER_LEFT.MESSAGE",
          values: {
            username: "Grace",
            numberOfPlayers: 1,
          },
        },
        durationMs: 5000,
      },
      {
        variant: "info",
        title: {
          translationKey: "GAME.NOTIFICATIONS.GAME_STARTED.TITLE",
        },
        message: {
          translationKey: "GAME.NOTIFICATIONS.GAME_STARTED.MESSAGE",
          values: {
            username: "Grace",
          },
        },
        durationMs: 5000,
      },
    ]);
    assert.equal(soundManager.mainThemePlayCount, 1);
    assert.equal(gameServer.gameFinishedSubscriptionCount, 1);
  });

  it("keeps a persistent notification for the current player's turn", () => {
    const alice = createPlayer({ id: "player-1", username: "Alice" });
    const bob = createPlayer({ id: "player-2", username: "Bob" });
    const gameServer = new GameServerSpy(createGameState({ players: [alice, bob] }));
    const notifier = new NotifierSpy();
    const soundManager = new SoundManagerSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager,
      gameMapApi: new GameMapApiFake(),
      notifier,
    });
    useGameSessionStore().setSession({ roomId: "room-1", playerId: "player-1" });

    new RegisterGameEventReactionsUseCase().execute();
    gameServer.emitTurnChanged({
      currentPlayer: alice,
      turnDurationInSeconds: 45,
      turnStartedAt: 10,
    });
    gameServer.emitTurnChanged({
      currentPlayer: bob,
      turnDurationInSeconds: 45,
      turnStartedAt: 55,
    });
    gameServer.emitGamePaused({
      pausedAt: 60,
      pausedByPlayerId: "player-2",
    });
    gameServer.emitGameFinished();

    assert.deepEqual(notifier.notifications, [
      {
        id: "current-turn",
        variant: "success",
        title: {
          translationKey: "GAME.NOTIFICATIONS.TURN.YOUR_TURN_TITLE",
        },
        message: {
          translationKey: "GAME.NOTIFICATIONS.TURN.YOUR_TURN_MESSAGE",
          values: {
            username: "Alice",
            seconds: 45,
          },
        },
        durationMs: 0,
        countdown: {
          startedAt: 10,
          endsAt: 45_010,
        },
      },
      {
        id: "current-turn",
        variant: "info",
        title: {
          translationKey: "GAME.NOTIFICATIONS.TURN.PLAYER_TURN_TITLE",
          values: {
            username: "Bob",
          },
        },
        message: {
          translationKey: "GAME.NOTIFICATIONS.TURN.PLAYER_TURN_MESSAGE",
          values: {
            username: "Bob",
            seconds: 45,
          },
        },
        durationMs: 0,
        countdown: {
          startedAt: 55,
          endsAt: 45_055,
        },
      },
    ]);
    assert.deepEqual(notifier.dismissedNotificationIds, ["current-turn", "current-turn"]);
    assert.equal(soundManager.mainThemeStopCount, 1);
  });

  it("caps the turn notification duration to the remaining game time", () => {
    const alice = createPlayer({ id: "player-1", username: "Alice" });
    const gameServer = new GameServerSpy(
      createGameState({
        players: [alice],
        status: GameStatus.PLAYING,
        turnDurationInSeconds: 45,
        startAt: 0,
        endAt: 30_000,
      }),
    );
    const notifier = new NotifierSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
      notifier,
    });
    const gameSessionStore = useGameSessionStore();
    gameSessionStore.setSession({ roomId: "room-1", playerId: "player-1" });
    gameSessionStore.setGameState(gameServer.getState());

    new RegisterGameEventReactionsUseCase().execute();
    gameServer.emitTurnChanged({
      currentPlayer: alice,
      turnDurationInSeconds: 45,
      turnStartedAt: 10_000,
    });

    assert.deepEqual(gameSessionStore.currentTurn, {
      playerId: "player-1",
      startedAt: 10_000,
      durationInSeconds: 20,
    });
    assert.deepEqual(notifier.notifications[0].message, {
      translationKey: "GAME.NOTIFICATIONS.TURN.YOUR_TURN_MESSAGE",
      values: {
        username: "Alice",
        seconds: 20,
      },
    });
    assert.deepEqual(notifier.notifications[0].countdown, {
      startedAt: 10_000,
      endsAt: 30_000,
    });
  });

  it("highlights the country found by a player", () => {
    const alice = createPlayer({ id: "player-1", username: "Alice" });
    const gameServer = new GameServerSpy(createGameState({ players: [alice] }));
    const soundManager = new SoundManagerSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager,
      gameMapApi: new GameMapApiFake(),
      notifier: new NotifierSpy(),
    });
    const gameSessionStore = useGameSessionStore();

    new RegisterGameEventReactionsUseCase().execute();
    gameServer.emitCountryFound({
      countryId: "CAN",
      foundByPlayer: alice,
      pointsAwarded: 1,
    });

    assert.equal(gameSessionStore.highlightedCountryId, "CAN");
    assert.deepEqual(gameSessionStore.foundCountryIds, ["CAN"]);
    assert.deepEqual(soundManager.playedEffects, [SoundEffectName.SUCCESS]);
  });

  it("notifies voters with actions when a player requests a voted game action", () => {
    const gameServer = new GameServerSpy();
    const notifier = new NotifierSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
      notifier,
    });
    useGameSessionStore().setSession({ roomId: "room-1", playerId: "player-1" });

    new RegisterGameEventReactionsUseCase().execute();
    gameServer.emitGameActionVoteRequested({
      requestId: "pause-request-1",
      action: "pause",
      requestedByPlayerId: "player-2",
      requestedByUsername: "Grace",
      requiredVoterIds: ["player-1"],
    });

    const notification = notifier.notifications[0];
    assert.equal(notification.variant, "warning");
    assert.deepEqual(notification.title, {
      translationKey: "GAME.NOTIFICATIONS.VOTE_REQUESTS.PAUSE.TITLE",
    });
    assert.deepEqual(notification.message, {
      translationKey: "GAME.NOTIFICATIONS.VOTE_REQUESTS.PAUSE.MESSAGE",
      values: {
        username: "Grace",
      },
    });
    assert.equal(notification.durationMs, 5000);
    assert.equal(notification.actions?.length, 2);

    notification.actions?.[0].run();
    notification.actions?.[1].run();

    assert.deepEqual(gameServer.voteGameActionCalls, [
      {
        action: "pause",
        requestId: "pause-request-1",
        accepted: true,
      },
      {
        action: "pause",
        requestId: "pause-request-1",
        accepted: false,
      },
    ]);
  });

  it("notifies the requester that the voted game action is waiting for approvals", () => {
    const gameServer = new GameServerSpy();
    const notifier = new NotifierSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
      notifier,
    });
    useGameSessionStore().setSession({ roomId: "room-1", playerId: "player-2" });

    new RegisterGameEventReactionsUseCase().execute();
    gameServer.emitGameActionVoteRequested({
      requestId: "restart-request-1",
      action: "restart",
      requestedByPlayerId: "player-2",
      requestedByUsername: "Grace",
      requiredVoterIds: ["player-1"],
    });

    assert.deepEqual(notifier.notifications, [
      {
        variant: "info",
        title: {
          translationKey: "GAME.NOTIFICATIONS.VOTE_REQUESTS.WAITING.RESTART.TITLE",
        },
        message: {
          translationKey: "GAME.NOTIFICATIONS.VOTE_REQUESTS.WAITING.RESTART.MESSAGE",
          values: {
            username: "Grace",
          },
        },
        durationMs: 5000,
        actions: [],
      },
    ]);
  });

  it("leaves the room locally when the current player declines a play again request", async () => {
    const gameServer = new GameServerSpy();
    const notifier = new NotifierSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
      notifier,
    });
    const gameSessionStore = useGameSessionStore();
    gameSessionStore.setSession({ roomId: "room-1", playerId: "player-1" });

    new RegisterGameEventReactionsUseCase().execute();
    gameServer.emitGameActionVoteRequested({
      requestId: "restart-request-1",
      action: "restart",
      requestedByPlayerId: "player-2",
      requestedByUsername: "Grace",
      requiredVoterIds: ["player-1"],
    });

    notifier.notifications[0].actions?.[1].run();
    await Promise.resolve();

    assert.deepEqual(gameServer.voteGameActionCalls, [
      {
        action: "restart",
        requestId: "restart-request-1",
        accepted: false,
      },
    ]);
    assert.equal(gameServer.leaveRoomCallCount, 1);
    assert.equal(gameSessionStore.isConnected, false);
  });

  it("ignores active game notifications while the current player is waiting in queue", () => {
    const alice = createPlayer({ id: "player-1", username: "Alice" });
    const gameServer = new GameServerSpy(
      createGameState({
        players: [alice],
        waitingPlayers: [{ id: "player-2", username: "Grace", joinedAt: 100 }],
      }),
    );
    const notifier = new NotifierSpy();
    restoreDependencies = overrideAppDependencies({
      ...gameGatewaysFrom(gameServer),
      soundManager: new SoundManagerSpy(),
      gameMapApi: new GameMapApiFake(),
      notifier,
    });
    const gameSessionStore = useGameSessionStore();
    gameSessionStore.setSession({ roomId: "room-1", playerId: "player-2" });
    gameSessionStore.setGameState(gameServer.getState());

    new RegisterGameEventReactionsUseCase().execute();
    gameServer.emitPlayerJoinRoom({
      playerId: "player-3",
      username: "Bob",
      numberOfPlayers: 2,
    });
    gameServer.emitGameStarted({
      startAt: 10,
      endAt: 310,
      durationInSeconds: 300,
      startedByPlayerId: "player-1",
      currentPlayerId: "player-1",
    });
    gameServer.emitTurnChanged({
      currentPlayer: alice,
      turnDurationInSeconds: 45,
      turnStartedAt: 10,
    });
    gameServer.emitCountryFound({
      countryId: "CAN",
      foundByPlayer: alice,
      pointsAwarded: 1,
    });
    gameServer.emitGameActionVoteRequested({
      requestId: "restart-request-1",
      action: "restart",
      requestedByPlayerId: "player-1",
      requestedByUsername: "Alice",
      requiredVoterIds: ["player-2"],
    });

    assert.deepEqual(notifier.notifications, []);
    assert.equal(gameSessionStore.currentTurn, null);
    assert.deepEqual(gameSessionStore.foundCountryIds, []);
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

    assert.equal(gameServer.playerJoinRoomSubscriptionCount, 2);
    assert.equal(gameServer.playerJoinRoomUnsubscriptionCount, 1);
    assert.equal(gameServer.playerLeftRoomSubscriptionCount, 2);
    assert.equal(gameServer.playerLeftRoomUnsubscriptionCount, 1);
    assert.equal(gameServer.gameStartedSubscriptionCount, 2);
    assert.equal(gameServer.gameStartedUnsubscriptionCount, 1);
    assert.equal(gameServer.gamePausedSubscriptionCount, 2);
    assert.equal(gameServer.gamePausedUnsubscriptionCount, 1);
    assert.equal(gameServer.gameResumedSubscriptionCount, 2);
    assert.equal(gameServer.gameResumedUnsubscriptionCount, 1);
    assert.equal(gameServer.turnChangedSubscriptionCount, 2);
    assert.equal(gameServer.turnChangedUnsubscriptionCount, 1);
    assert.equal(gameServer.countryFoundSubscriptionCount, 2);
    assert.equal(gameServer.countryFoundUnsubscriptionCount, 1);
    assert.equal(gameServer.gameActionVoteRequestedSubscriptionCount, 2);
    assert.equal(gameServer.gameActionVoteRequestedUnsubscriptionCount, 1);
    assert.equal(gameServer.gameFinishedSubscriptionCount, 2);
    assert.equal(gameServer.gameFinishedUnsubscriptionCount, 1);
    assert.equal(gameServer.gameRestartedSubscriptionCount, 2);
    assert.equal(gameServer.gameRestartedUnsubscriptionCount, 1);
  });
});
