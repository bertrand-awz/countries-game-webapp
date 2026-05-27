import type { Player } from "@/domain/game/models/Player.ts";

export type TurnChangedEvent = {
  currentPlayer: Player;
};
