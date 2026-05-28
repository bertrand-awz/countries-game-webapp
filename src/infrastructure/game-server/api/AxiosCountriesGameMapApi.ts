import axios, { type AxiosInstance } from "axios";

import type { GameMapApi } from "@/domain/game/ports/GameMapApi.ts";
import type { Continents } from "@/domain/game/models/Continent.ts";
import type { Countries } from "@/domain/game/models/Country.ts";

export class AxiosCountriesGameMapApi implements GameMapApi {
  private readonly apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: "http://localhost:2567",
    });
  }

  async getContinents(): Promise<Continents> {
    const response = await this.apiClient.get<Continents>("/api/continents");
    return response.data;
  }

  async getCountries(): Promise<Countries> {
    const response = await this.apiClient.get<Countries>("/api/countries");
    return response.data;
  }
}
