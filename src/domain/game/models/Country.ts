import type { Polygon, MultiPolygon } from "geojson";

export type Country = {
  type: "Feature";
  id: string;
  properties: {
    id: string;
  };
  geometry: Polygon | MultiPolygon;
};

export type Countries = {
  type: "FeatureCollection";
  features: Country[];
};
