import type { Player } from "@/domain/game/models/Player.ts";

export type CountryFoundEvent = {
  countryId: string;
  foundByPlayer: Player;
  pointsAwarded: number;
};
