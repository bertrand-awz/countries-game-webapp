import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { PlayerJoinRoomEvent } from "@/domain/game/events/PlayerJoinRoomEvent.ts";
import type { TurnChangedEvent } from "@/domain/game/events/TurnChangedEvent.ts";
import { GameStatus } from "@/domain/game/models/state/GameState.ts";
import { ColyseusGameServer } from "@/infrastructure/game-server/colyseus/ColyseusGameServer.ts";
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

function createServerWithRoom(room: object): ColyseusGameServer {
  const server = Object.create(ColyseusGameServer.prototype) as ColyseusGameServer;
  const serverInternals = server as unknown as {
    room: object;
  };
  serverInternals.room = room;

  return server;
}

describe("ColyseusGameServer", () => {
  it("sends game commands with the messages expected by the Colyseus room", () => {
    const sendCalls: SendCall[] = [];
    const server = createServerWithRoom({
      send: (message: GameRoomMessage, payload?: unknown) => {
        sendCalls.push({ message, payload });
      },
    });

    server.submitCountry("Canada");
    server.pauseGame();
    server.resumeGame();
    server.restartGame();
    server.startGame();

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
        payload: undefined,
      },
      {
        message: GameRoomMessage.START_GAME,
        payload: {},
      },
    ]);
  });

  it("maps Colyseus room messages to the domain event contract", () => {
    const handlers = new Map<GameRoomMessage, MessageHandler>();
    const player = createPlayer({ id: "player-1", username: "Ada" });
    const server = createServerWithRoom({
      onMessage: (message: GameRoomMessage, handler: MessageHandler) => {
        handlers.set(message, handler);
      },
    });
    let playerJoinEvent: PlayerJoinRoomEvent | null = null;
    let turnChangedEvent: TurnChangedEvent | null = null;
    let rejectedReason: string | null = null;
    let foundCountryId: string | null = null;

    server.onPlayerJoinRoom((event) => {
      playerJoinEvent = event;
    });
    server.onTurnChanged((event) => {
      turnChangedEvent = event;
    });
    server.onCountryRejected((event) => {
      rejectedReason = event.reason;
    });
    server.onCountryFound((event) => {
      foundCountryId = event.countryId;
    });

    handlers.get(GameRoomMessage.PLAYER_JOIN_ROOM)?.({ player });
    handlers.get(GameRoomMessage.TURN_CHANGED)?.({ player });
    handlers.get(GameRoomMessage.COUNTRY_REJECTED)?.({ reason: "already found" });
    handlers.get(GameRoomMessage.COUNTRY_FOUND)?.({
      countryId: "CAN",
      player,
      pointsAwarded: 10,
    });

    assert.deepEqual(playerJoinEvent, { player });
    assert.deepEqual(turnChangedEvent, { currentPlayer: player });
    assert.equal(rejectedReason, "already found");
    assert.equal(foundCountryId, "CAN");
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
    const server = createServerWithRoom({
      onStateChange,
    });
    let mappedState = createGameState({ status: GameStatus.WAITING });

    const unsubscribe = server.onStateChange((state) => {
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
    const server = createServerWithRoom({
      leave: async () => {
        leaveCallCount++;
      },
    });

    await server.leaveRoom();
    await server.leaveRoom();

    assert.equal(leaveCallCount, 1);
    assert.equal(server.hasActiveRoom(), false);
  });
});
