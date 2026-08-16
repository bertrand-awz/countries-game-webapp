import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { GameActionVoteRequestedEvent } from "@/domain/game/events/GameActionVoteRequestedEvent.ts";
import type { GameFinishedEvent } from "@/domain/game/events/GameFinishedEvent.ts";
import type { GameRestartedEvent } from "@/domain/game/events/GameRestartedEvent.ts";
import type { GameStartedEvent } from "@/domain/game/events/GameStartedEvent.ts";
import type { PlayerJoinRoomEvent } from "@/domain/game/events/PlayerJoinRoomEvent.ts";
import type { PlayerLeftRoomEvent } from "@/domain/game/events/PlayerLeftRoomEvent.ts";
import type { TurnChangedEvent } from "@/domain/game/events/TurnChangedEvent.ts";
import { GameStatus } from "@/domain/game/models/state/GameState.ts";
import { ColyseusGameCommandGateway } from "@/infrastructure/game-server/colyseus/ColyseusGameCommandGateway.ts";
import { ColyseusGameEventGateway } from "@/infrastructure/game-server/colyseus/ColyseusGameEventGateway.ts";
import { ColyseusRoomGateway } from "@/infrastructure/game-server/colyseus/ColyseusRoomGateway.ts";
import { GameRoomMessage } from "@/infrastructure/game-server/colyseus/messages/GameRoomMessage.ts";

import {
  createGameState,
  createPlayer,
} from "../../../domain/game/models/state/gameStateMother.ts";

type SendCall = {
  message: GameRoomMessage;
  payload?: unknown;
};

type MessageHandler = (message: unknown) => void;

function createRoomGatewayWithRoom(room: object): ColyseusRoomGateway {
  const gateway = Object.create(ColyseusRoomGateway.prototype) as ColyseusRoomGateway;
  const gatewayInternals = gateway as unknown as {
    room: object;
  };
  gatewayInternals.room = room;

  return gateway;
}

describe("Colyseus game gateways", () => {
  it("sends game commands with the messages expected by the Colyseus room", () => {
    const sendCalls: SendCall[] = [];
    const commands = new ColyseusGameCommandGateway(
      createRoomGatewayWithRoom({
        send: (message: GameRoomMessage, payload?: unknown) => {
          sendCalls.push({ message, payload });
        },
      }),
    );

    commands.submitCountry("Canada");
    commands.pauseGame();
    commands.resumeGame();
    commands.restartGame();
    commands.startGame();
    commands.updateRoomSettings({
      gameDurationInSeconds: 300,
      turnDurationInSeconds: 45,
      maxPlayersAllowed: 4,
    });
    commands.voteGameAction("pause", "request-1", true);
    commands.voteGameAction("resume", "request-2", false);
    commands.voteGameAction("restart", "request-3", true);

    assert.deepEqual(sendCalls, [
      {
        message: GameRoomMessage.SUBMIT_COUNTRY_NAME,
        payload: {
          countryName: "Canada",
        },
      },
      {
        message: GameRoomMessage.PAUSE_GAME,
        payload: {},
      },
      {
        message: GameRoomMessage.RESUME_GAME,
        payload: {},
      },
      {
        message: GameRoomMessage.RESTART_GAME,
        payload: {},
      },
      {
        message: GameRoomMessage.START_GAME,
        payload: {},
      },
      {
        message: GameRoomMessage.UPDATE_ROOM_SETTINGS,
        payload: {
          gameDurationInSeconds: 300,
          turnDurationInSeconds: 45,
          maxPlayersAllowed: 4,
        },
      },
      {
        message: GameRoomMessage.VOTE_PAUSE_GAME,
        payload: {
          requestId: "request-1",
          accepted: true,
        },
      },
      {
        message: GameRoomMessage.VOTE_RESUME_GAME,
        payload: {
          requestId: "request-2",
          accepted: false,
        },
      },
      {
        message: GameRoomMessage.VOTE_RESTART_GAME,
        payload: {
          requestId: "request-3",
          accepted: true,
        },
      },
    ]);
  });

  it("maps Colyseus room messages to the domain event contract", () => {
    const handlers = new Map<GameRoomMessage, MessageHandler>();
    const player = createPlayer({ id: "player-1", username: "Ada" });
    const events = new ColyseusGameEventGateway(
      createRoomGatewayWithRoom({
        onMessage: (message: GameRoomMessage, handler: MessageHandler) => {
          handlers.set(message, handler);
          return () => handlers.delete(message);
        },
      }),
    );
    let playerJoinEvent: PlayerJoinRoomEvent | null = null;
    let playerLeftEvent: PlayerLeftRoomEvent | null = null;
    let turnChangedEvent: TurnChangedEvent | null = null;
    let gameStartedEvent: GameStartedEvent | null = null;
    let gameRestartedEvent: GameRestartedEvent | null = null;
    let voteRequestedEvent: GameActionVoteRequestedEvent | null = null;
    let gameFinishedEvent: GameFinishedEvent | null = null;
    let rejectedReason: string | null = null;
    let foundCountryId: string | null = null;

    events.onPlayerJoinRoom((event) => {
      playerJoinEvent = event;
    });
    events.onPlayerLeftRoom((event) => {
      playerLeftEvent = event;
    });
    events.onTurnChanged((event) => {
      turnChangedEvent = event;
    });
    events.onCountryRejected((event) => {
      rejectedReason = event.reason;
    });
    events.onCountryFound((event) => {
      foundCountryId = event.countryId;
    });
    const unsubscribeGameFinished = events.onGameFinished((event) => {
      gameFinishedEvent = event;
    });
    events.onGameStarted((event) => {
      gameStartedEvent = event;
    });
    events.onGameRestarted((event) => {
      gameRestartedEvent = event;
    });
    const unsubscribeVoteRequest = events.onGameActionVoteRequested((event) => {
      voteRequestedEvent = event;
    });

    handlers.get(GameRoomMessage.PLAYER_JOIN_ROOM)?.({
      playerSessionId: "player-2",
      username: "Grace",
      numberOfPlayers: 2,
    });
    handlers.get(GameRoomMessage.PLAYER_LEFT_ROOM)?.({
      playerSessionId: "player-2",
      username: "Grace",
      numberOfPlayers: 1,
      code: 1000,
    });
    handlers.get(GameRoomMessage.TURN_CHANGED)?.({
      player,
      turnDurationInSeconds: 45,
      turnStartedAt: 123,
    });
    handlers.get(GameRoomMessage.COUNTRY_REJECTED)?.({ reason: "already found" });
    handlers.get(GameRoomMessage.COUNTRY_FOUND)?.({
      countryId: "CAN",
      player,
      pointsAwarded: 10,
    });
    handlers.get(GameRoomMessage.GAME_STARTED)?.({
      startAt: 10,
      endAt: 310,
      durationInSeconds: 300,
      currentPlayerSessionId: "player-1",
      startedBy: "player-2",
    });
    handlers.get(GameRoomMessage.GAME_RESTARTED)?.({
      restartedAt: 500,
      currentPlayerSessionId: "player-1",
      restartedBy: "player-2",
    });
    handlers.get(GameRoomMessage.PAUSE_GAME_REQUESTED)?.({
      requestId: "pause-request-1",
      requestedByPlayerSessionId: "player-2",
      requestedByUsername: "Grace",
      requiredVoterSessionIds: ["player-1"],
    });
    handlers.get(GameRoomMessage.GAME_FINISHED)?.({ winner: player, reason: "time_elapsed" });
    unsubscribeGameFinished();
    unsubscribeVoteRequest();

    assert.deepEqual(playerJoinEvent, {
      playerId: "player-2",
      username: "Grace",
      numberOfPlayers: 2,
    });
    assert.deepEqual(playerLeftEvent, {
      playerId: "player-2",
      username: "Grace",
      numberOfPlayers: 1,
      code: 1000,
    });
    assert.deepEqual(turnChangedEvent, {
      currentPlayer: player,
      turnDurationInSeconds: 45,
      turnStartedAt: 123,
    });
    assert.equal(rejectedReason, "already found");
    assert.equal(foundCountryId, "CAN");
    assert.deepEqual(gameStartedEvent, {
      startAt: 10,
      endAt: 310,
      durationInSeconds: 300,
      currentPlayerId: "player-1",
      startedByPlayerId: "player-2",
    });
    assert.deepEqual(gameRestartedEvent, {
      restartedAt: 500,
      currentPlayerId: "player-1",
      restartedByPlayerId: "player-2",
    });
    assert.deepEqual(voteRequestedEvent, {
      requestId: "pause-request-1",
      action: "pause",
      requestedByPlayerId: "player-2",
      requestedByUsername: "Grace",
      requiredVoterIds: ["player-1"],
    });
    assert.deepEqual(gameFinishedEvent, { winner: player, reason: "time_elapsed" });
    assert.equal(handlers.has(GameRoomMessage.GAME_FINISHED), false);
    assert.equal(handlers.has(GameRoomMessage.PAUSE_GAME_REQUESTED), false);
    assert.equal(handlers.has(GameRoomMessage.RESUME_GAME_REQUESTED), false);
    assert.equal(handlers.has(GameRoomMessage.RESTART_GAME_REQUESTED), false);
  });

  it("maps state changes into domain game states and returns an unsubscribe callback", () => {
    const rawState = {
      numberOfPlayers: 1,
      defaultLanguage: "fr",
      durationInSeconds: 300,
      startAt: 10,
      endAt: 310,
      status: GameStatus.PLAYING,
      continents: [],
      allowAnswerValidationInPlayerCurrentLanguage: false,
      players: [
        {
          id: "player-1",
          username: "Ada",
          score: 7,
          totalCountriesFound: 2,
        },
      ],
    };
    let registeredStateHandler: ((state: unknown) => void) | null = null;
    const removedHandlers: Array<(state: unknown) => void> = [];
    const onStateChange = ((handler: (state: unknown) => void) => {
      registeredStateHandler = handler;
    }) as ((handler: (state: unknown) => void) => void) & {
      remove(handler: (state: unknown) => void): void;
    };
    onStateChange.remove = (handler) => {
      removedHandlers.push(handler);
    };
    const events = new ColyseusGameEventGateway(
      createRoomGatewayWithRoom({
        onStateChange,
      }),
    );
    let mappedState = createGameState({ status: GameStatus.WAITING });

    const unsubscribe = events.onStateChange((state) => {
      mappedState = state;
    });
    assert.notEqual(registeredStateHandler, null);
    const stateHandler = registeredStateHandler as unknown as (state: unknown) => void;
    stateHandler(rawState);
    unsubscribe();

    assert.equal(mappedState.status, GameStatus.PLAYING);
    assert.equal(mappedState.players[0].getId(), "player-1");
    assert.deepEqual(removedHandlers, [stateHandler]);
  });

  it("leaves the active room once and then behaves as disconnected", async () => {
    let leaveCallCount = 0;
    const roomGateway = createRoomGatewayWithRoom({
      leave: async () => {
        leaveCallCount++;
      },
    });

    await roomGateway.leaveRoom();
    await roomGateway.leaveRoom();

    assert.equal(leaveCallCount, 1);
    assert.equal(roomGateway.hasActiveRoom(), false);
  });
});
