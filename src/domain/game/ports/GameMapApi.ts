import type { Countries } from "@/domain/game/models/Country.ts";
import type { Continents } from "@/domain/game/models/Continent.ts";

export interface GameMapApi {
  getCountries(): Promise<Countries>;
  getContinents(): Promise<Continents>;
}
