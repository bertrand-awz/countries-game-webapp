import { Client, Room } from "@colyseus/sdk";

import type {
  CreateRoomOptions,
  GameServer,
  GameSession,
  JoinRoomOptions,
} from "@/domain/game/ports/GameServer.ts";

import type { CountryFoundEvent } from "@/domain/game/events/CountryFoundEvent.ts";
import type { CountryRejectedEvent } from "@/domain/game/events/CountryRejectedEvent.ts";
import type { TurnChangedEvent } from "@/domain/game/events/TurnChangedEvent.ts";
import type { GameState } from "@/domain/game/models/state/GameState.ts";
import { GameRoomMessage } from "./messages/GameRoomMessage.js";
import { GameStateMapper } from "./mappers/GameStateMapper.js";

const COUNTRIES_GAME_ROOM_NAME = "countries_game";

export class ColyseusGameServer implements GameServer {
  private readonly client: Client;
  private room: Room | null = null;

  constructor(endpoint: string = "ws://localhost:2567") {
    this.client = new Client(endpoint);
  }

  async createRoom(options: CreateRoomOptions): Promise<GameSession> {
    this.room = await this.client.create(COUNTRIES_GAME_ROOM_NAME, {
      gameLanguage: options.gameLanguage,
      gameDurationInSeconds: options.gameDurationInSeconds,
      maxPlayersAllowed: options.maxPlayersAllowed,
      username: options.username,
    });

    return this.toGameSession(this.room);
  }

  async joinRoom(options: JoinRoomOptions): Promise<GameSession> {
    this.room = await this.client.joinById(options.roomId, {
      username: options.username,
    });

    return this.toGameSession(this.room);
  }

  async leaveRoom(): Promise<void> {
    if (!this.room) {
      return;
    }

    await this.room.leave();
    this.room = null;
  }

  onCountryFound(callback: (event: CountryFoundEvent) => void): void {
    this.ensureRoom().onMessage(GameRoomMessage.COUNTRY_FOUND, (message) => {
      callback({
        countryId: message.countryId,
        foundByPlayer: message.player,
        pointsAwarded: message.pointsAwarded,
      });
    });
  }

  onCountryRejected(callback: (event: CountryRejectedEvent) => void): void {
    this.ensureRoom().onMessage(GameRoomMessage.COUNTRY_REJECTED, (message) => {
      callback({
        reason: message.reason,
      });
    });
  }

  onStateChange(callback: (state: GameState) => void): void {
    this.ensureRoom().onStateChange((colyseusState) => {
      callback(GameStateMapper.fromColyseusState(colyseusState));
    });
  }

  onTurnChanged(callback: (event: TurnChangedEvent) => void): void {
    this.ensureRoom().onMessage(GameRoomMessage.TURN_CHANGED, (message) => {
      callback({
        currentPlayer: message.player,
      });
    });
  }

  pauseGame(): void {
    this.ensureRoom().send(GameRoomMessage.PAUSE_GAME);
  }

  restartGame(): void {
    this.ensureRoom().send(GameRoomMessage.RESTART_GAME);
  }

  resumeGame(): void {
    this.ensureRoom().send(GameRoomMessage.RESUME_GAME);
  }

  submitCountry(countryName: string): void {
    this.ensureRoom().send(GameRoomMessage.SUBMIT_COUNTRY, {
      countryName,
    });
  }

  private ensureRoom(): Room {
    if (!this.room) {
      throw new Error("You must create or join a room before using the game server.");
    }

    return this.room;
  }

  private toGameSession(room: Room): GameSession {
    return {
      roomId: room.roomId,
      playerId: room.sessionId,
    };
  }
}

export const gameServer = new ColyseusGameServer();
