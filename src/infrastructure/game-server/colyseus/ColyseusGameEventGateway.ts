import type { CountryFoundEvent } from "@/domain/game/events/CountryFoundEvent.ts";
import type { CountryRejectedEvent } from "@/domain/game/events/CountryRejectedEvent.ts";
import type { GameFinishedEvent } from "@/domain/game/events/GameFinishedEvent.ts";
import type { PlayerJoinRoomEvent } from "@/domain/game/events/PlayerJoinRoomEvent.ts";
import type { TurnChangedEvent } from "@/domain/game/events/TurnChangedEvent.ts";
import type { GameState } from "@/domain/game/models/state/GameState.ts";
import type { GameEventGateway, Unsubscribe } from "@/domain/game/ports/GameServer.ts";

import type { ColyseusRoomGateway } from "./ColyseusRoomGateway.js";
import { GameStateMapper } from "./mappers/GameStateMapper.js";
import { GameRoomMessage } from "./messages/GameRoomMessage.js";

export class ColyseusGameEventGateway implements GameEventGateway {
  constructor(private readonly roomGateway: ColyseusRoomGateway) {}

  onCountryFound(callback: (event: CountryFoundEvent) => void): Unsubscribe {
    return this.roomGateway.getActiveRoom().onMessage(GameRoomMessage.COUNTRY_FOUND, (message) => {
      callback({
        countryId: message.countryId,
        foundByPlayer: message.player,
        pointsAwarded: message.pointsAwarded,
      });
    });
  }

  onCountryRejected(callback: (event: CountryRejectedEvent) => void): Unsubscribe {
    return this.roomGateway
      .getActiveRoom()
      .onMessage(GameRoomMessage.COUNTRY_REJECTED, (message) => {
        callback({
          reason: message.reason,
        });
      });
  }

  onStateChange(callback: (state: GameState) => void): Unsubscribe {
    const room = this.roomGateway.getActiveRoom();
    const stateChangeHandler = (colyseusState: unknown) => {
      callback(GameStateMapper.fromColyseusState(colyseusState));
    };

    room.onStateChange(stateChangeHandler);

    return () => room.onStateChange.remove(stateChangeHandler);
  }

  onPlayerJoinRoom(callback: (event: PlayerJoinRoomEvent) => void): Unsubscribe {
    return this.roomGateway
      .getActiveRoom()
      .onMessage(GameRoomMessage.PLAYER_JOIN_ROOM, (message) => {
        callback({
          player: message.player,
        });
      });
  }

  onTurnChanged(callback: (event: TurnChangedEvent) => void): Unsubscribe {
    return this.roomGateway.getActiveRoom().onMessage(GameRoomMessage.TURN_CHANGED, (message) => {
      callback({
        currentPlayer: message.player,
      });
    });
  }

  onGameFinished(callback: (event: GameFinishedEvent) => void): Unsubscribe {
    return this.roomGateway.getActiveRoom().onMessage(GameRoomMessage.GAME_FINISHED, (message) => {
      callback({
        winner: message.winner ?? message.player,
        reason: message.reason,
      });
    });
  }
}
