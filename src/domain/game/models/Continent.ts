import type { SupportedLanguage } from "@/domain/shared/models/SupportedLanguage.ts";

type ContinentId =
  | "AFRICA"
  | "ASIA"
  | "EUROPE"
  | "NORTH_AMERICA"
  | "SOUTH_AMERICA"
  | "OCEANIA"
  | "SEVEN_SEAS";

export type Continent = {
  id: ContinentId;
  countriesNumber: number;
};

export type Continents = {
  continents: Continent[];
  namesTranslations: Record<SupportedLanguage, string>;
};
