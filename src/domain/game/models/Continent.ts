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
