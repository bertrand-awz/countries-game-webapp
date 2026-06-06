import { defineStore } from "pinia";

import { useAppDependencies } from "@/app/composables/useAppDependencies.ts";
import type { Continent } from "@/domain/game/models/Continent.ts";
import type { Countries, Country } from "@/domain/game/models/Country.ts";

type GameMapStoreState = {
  continents: Continent[];
  countries: Countries;
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
};

const emptyCountries: Countries = {
  type: "FeatureCollection",
  features: [],
};

export const useGameMapStore = defineStore("gameMap", {
  state: (): GameMapStoreState => ({
    continents: [],
    countries: emptyCountries,
    isLoading: false,
    isLoaded: false,
    error: null,
  }),

  getters: {
    isEmpty(state): boolean {
      return state.continents.length === 0 && state.countries.features.length === 0;
    },

    getCountriesFeatures(state): Country[] {
      return state.countries.features;
    },

    getContinents(state): Continent[] {
      return state.continents;
    },

    getCountryById:
      (state) =>
      (countryId: string): Country | undefined => {
        return state.countries.features.find(
          (country) => country.id === countryId || country.properties.id === countryId,
        );
      },
  },

  actions: {
    async preload(): Promise<void> {
      const { gameMapApi } = useAppDependencies();
      if (this.isLoaded || this.isLoading) {
        return;
      }

      this.isLoading = true;
      this.error = null;

      try {
        const [continents, countries] = await Promise.all([
          gameMapApi.getContinents(),
          gameMapApi.getCountries(),
        ]);

        this.continents = continents;
        this.countries = countries;
        this.isLoaded = true;
      } catch (error) {
        this.error = "Unable to load game map data";
        this.continents = [];
        this.countries = {
          type: "FeatureCollection",
          features: [],
        };
        this.isLoaded = false;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    reset(): void {
      this.continents = [];
      this.countries = {
        type: "FeatureCollection",
        features: [],
      };
      this.isLoading = false;
      this.isLoaded = false;
      this.error = null;
    },
  },
});
