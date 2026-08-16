import type { GameActionVote } from "@/domain/game/events/GameActionVoteRequestedEvent.ts";
import type {
  GameCommandGateway,
  UpdateRoomSettingsOptions,
} from "@/domain/game/ports/GameServer.ts";

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
    this.roomGateway.getActiveRoom().send(GameRoomMessage.RESTART_GAME, {});
  }

  resumeGame(): void {
    this.roomGateway.getActiveRoom().send(GameRoomMessage.RESUME_GAME, {});
  }

  submitCountry(countryName: string): void {
    this.roomGateway.getActiveRoom().send(GameRoomMessage.SUBMIT_COUNTRY_NAME, {
      countryName,
    });
  }

  updateRoomSettings(options: UpdateRoomSettingsOptions): void {
    this.roomGateway.getActiveRoom().send(GameRoomMessage.UPDATE_ROOM_SETTINGS, options);
  }

  voteGameAction(action: GameActionVote, requestId: string, accepted: boolean): void {
    this.roomGateway.getActiveRoom().send(gameVoteMessages[action], {
      requestId,
      accepted,
    });
  }
}

const gameVoteMessages: Record<GameActionVote, GameRoomMessage> = {
  pause: GameRoomMessage.VOTE_PAUSE_GAME,
  resume: GameRoomMessage.VOTE_RESUME_GAME,
  restart: GameRoomMessage.VOTE_RESTART_GAME,
};
