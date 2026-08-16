import type { GameCommandGateway } from "@/domain/game/ports/GameServer.ts";

import type { ColyseusRoomGateway } from "./ColyseusRoomGateway.js";
import { GameRoomMessage } from "./messages/GameRoomMessage.js";

export class ColyseusGameCommandGateway implements GameCommandGateway {
  constructor(private readonly roomGateway: ColyseusRoomGateway) {}

  pauseGame(): void {
    this.roomGateway.getActiveRoom().send(GameRoomMessage.PAUSE_GAME, {});
  }

  startGame(): void {
    this.roomGateway.getActiveRoom().send(GameRoomMessage.START_GAME, {});
  }

  restartGame(): void {
    this.roomGateway.getActiveRoom().send(GameRoomMessage.RESTART_GAME);
  }

  resumeGame(): void {
    this.roomGateway.getActiveRoom().send(GameRoomMessage.RESUME_GAME, {});
  }

  submitCountry(countryName: string): void {
    this.roomGateway.getActiveRoom().send(GameRoomMessage.SUBMIT_COUNTRY_NAME, {
      countryName,
    });
  }
}
