import type { Player } from "@/domain/game/models/Player.ts";

export type GameFinishedEvent = {
  winner?: Player;
  reason?: string;
};
