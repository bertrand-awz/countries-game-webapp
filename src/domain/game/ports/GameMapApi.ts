import type { Continent } from "@/domain/game/models/Continent.ts";
import type { Countries } from "@/domain/game/models/Country.ts";

export interface GameMapApi {
  getCountries(): Promise<Countries>;
  getContinents(): Promise<Continent[]>;
}
