import type { Countries, Country } from "@/domain/game/models/Country.ts";

type CountryMotherOptions = {
  id?: string;
  propertyId?: string;
};

export function createCountry(options: CountryMotherOptions = {}): Country {
  const id = options.id ?? options.propertyId ?? "CAN";

  return {
    type: "Feature",
    id,
    properties: {
      id: options.propertyId ?? id,
    },
    geometry: {
      type: "Polygon",
      coordinates: [],
    },
  };
}

export function createCountries(...countries: Country[]): Countries {
  return {
    type: "FeatureCollection",
    features: countries,
  };
}
