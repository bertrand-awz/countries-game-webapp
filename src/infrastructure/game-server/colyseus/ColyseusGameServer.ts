import { Client, Room } from "@colyseus/sdk";

import type { CountryFoundEvent } from "@/domain/game/events/CountryFoundEvent.ts";
import type { CountryRejectedEvent } from "@/domain/game/events/CountryRejectedEvent.ts";
import type { PlayerJoinRoomEvent } from "@/domain/game/events/PlayerJoinRoomEvent.ts";
import type { TurnChangedEvent } from "@/domain/game/events/TurnChangedEvent.ts";
import type { GameState } from "@/domain/game/models/state/GameState.ts";
import type {
  CreateRoomOptions,
  GameServer,
  GameSession,
  JoinRoomOptions,
} from "@/domain/game/ports/GameServer.ts";

import { GameStateMapper } from "./mappers/GameStateMapper.js";
import { GameRoomMessage } from "./messages/GameRoomMessage.js";

const COUNTRIES_GAME_ROOM_NAME = "countries_game";

export class ColyseusGameServer implements GameServer {
  private readonly client: Client;
  private room: Room | null = null;

  constructor(endpoint: string = "http://localhost:2567") {
    this.client = new Client(endpoint);
  }

  async createRoom(options: CreateRoomOptions): Promise<GameSession> {
    const room = await this.client.create(COUNTRIES_GAME_ROOM_NAME, {
      gameLanguage: options.gameLanguage,
      gameDurationInSeconds: options.gameDurationInSeconds,
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
    return GameStateMapper.fromColyseusState(this.ensureRoom().state);
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

  onStateChange(callback: (state: GameState) => void): () => void {
    const room = this.ensureRoom();
    const stateChangeHandler = (colyseusState: unknown) => {
      callback(GameStateMapper.fromColyseusState(colyseusState));
    };

    room.onStateChange(stateChangeHandler);

    return () => room.onStateChange.remove(stateChangeHandler);
  }

  onPlayerJoinRoom(callback: (event: PlayerJoinRoomEvent) => void): void {
    this.ensureRoom().onMessage(GameRoomMessage.PLAYER_JOIN_ROOM, (message) => {
      callback(message.player);
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
    this.ensureRoom().send(GameRoomMessage.PAUSE_GAME, {});
  }

  startGame(): void {
    this.ensureRoom().send(GameRoomMessage.START_GAME, {});
  }

  restartGame(): void {
    this.ensureRoom().send(GameRoomMessage.RESTART_GAME);
  }

  resumeGame(): void {
    this.ensureRoom().send(GameRoomMessage.RESUME_GAME, {});
  }

  submitCountry(countryName: string): void {
    this.ensureRoom().send(GameRoomMessage.SUBMIT_COUNTRY_NAME, {
      countryName,
    });
  }

  private ensureRoom(): Room {
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
