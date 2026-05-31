import type { Continent } from "@/domain/game/models/Continent.ts";

export type FoundingContinentProgressionState = {
  continent: Continent;
  countriesFoundNumber: number;
};

export function createFoundingContinentProgressiveStatesForContinents(
  continents: Continent[],
): FoundingContinentProgressionState[] {
  return continents.map((continent) => ({
    continent,
    countriesFoundNumber: 0,
  }));
}
