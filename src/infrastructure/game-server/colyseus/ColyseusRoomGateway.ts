import { Client, Room } from "@colyseus/sdk";

import type { GameState } from "@/domain/game/models/state/GameState.ts";
import type {
  CreateRoomOptions,
  GameRoomGateway,
  GameSession,
  JoinRoomOptions,
} from "@/domain/game/ports/GameServer.ts";

import { GameStateMapper } from "./mappers/GameStateMapper.js";

const COUNTRIES_GAME_ROOM_NAME = "countries_game";

export class ColyseusRoomGateway implements GameRoomGateway {
  private readonly client: Client;
  private room: Room | null = null;

  constructor(endpoint: string = "http://localhost:2567") {
    this.client = new Client(endpoint);
  }

  async createRoom(options: CreateRoomOptions): Promise<GameSession> {
    const room = await this.client.create(COUNTRIES_GAME_ROOM_NAME, {
      gameLanguage: options.gameLanguage,
      gameDurationInSeconds: options.gameDurationInSeconds,
      turnDurationInSeconds: options.turnDurationInSeconds,
      maxPlayersAllowed: options.maxPlayersAllowed,
      username: options.username,
    });

    return this.initializeRoom(room);
  }

  async joinRoom(options: JoinRoomOptions): Promise<GameSession> {
    const room = await this.client.joinById(options.roomId, {
      username: options.username,
    });

    return this.initializeRoom(room);
  }

  hasActiveRoom(): boolean {
    return this.room !== null;
  }

  getState(): GameState {
    return GameStateMapper.fromColyseusState(this.getActiveRoom().state);
  }

  async leaveRoom(): Promise<void> {
    if (!this.room) {
      return;
    }

    await this.room.leave();
    this.room = null;
  }

  getActiveRoom(): Room {
    if (!this.room) {
      throw new Error("You must create or join a room before using the game server.");
    }

    return this.room;
  }

  private async initializeRoom(room: Room): Promise<GameSession> {
    await this.waitForInitialState(room);
    this.room = room;

    return this.toGameSession(room);
  }

  private waitForInitialState(room: Room): Promise<void> {
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        room.onStateChange.remove(onStateChange);
        room.onError.remove(onError);
        room.onLeave.remove(onLeave);
      };
      const onStateChange = () => {
        cleanup();
        resolve();
      };
      const onError = (code: number, message?: string) => {
        cleanup();
        reject(new Error(message ?? `Unable to receive the room state (code ${code}).`));
      };
      const onLeave = (code: number, reason?: string) => {
        cleanup();
        reject(new Error(reason ?? `Room closed before its state was ready (code ${code}).`));
      };

      room.onStateChange(onStateChange);
      room.onError(onError);
      room.onLeave(onLeave);
    });
  }

  private toGameSession(room: Room): GameSession {
    return {
      roomId: room.roomId,
      playerId: room.sessionId,
    };
  }
}
