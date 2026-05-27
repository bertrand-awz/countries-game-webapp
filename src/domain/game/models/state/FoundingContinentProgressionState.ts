import type { Continent } from "@/domain/game/models/Continent.ts";

export type FoundingContinentProgressionState = {
  continent: Continent;
  countriesFoundNumber: number;
};
