import type { Continent } from "@/domain/game/models/Continent.ts";
import type { Countries } from "@/domain/game/models/Country.ts";
import type { GameMapApi } from "@/domain/game/ports/GameMapApi.ts";

export class GameMapApiFake implements GameMapApi {
  getContinentsCallCount = 0;
  getCountriesCallCount = 0;

  constructor(
    private continentsResult: Continent[] | Promise<Continent[]> = [],
    private countriesResult: Countries | Promise<Countries> = {
      type: "FeatureCollection",
      features: [],
    },
  ) {}

  async getContinents(): Promise<Continent[]> {
    this.getContinentsCallCount++;
    return this.continentsResult;
  }

  async getCountries(): Promise<Countries> {
    this.getCountriesCallCount++;
    return this.countriesResult;
  }
}
