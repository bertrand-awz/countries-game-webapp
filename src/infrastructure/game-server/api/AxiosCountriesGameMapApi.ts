import axios, { type AxiosInstance } from "axios";

import type { Continent } from "@/domain/game/models/Continent.ts";
import type { Countries } from "@/domain/game/models/Country.ts";
import type { GameMapApi } from "@/domain/game/ports/GameMapApi.ts";

export class AxiosGameMapApi implements GameMapApi {
  private readonly apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: "http://localhost:2567",
    });
  }

  async getContinents(): Promise<Continent[]> {
    const response = await this.apiClient.get<Continent[]>("/api/map/continents");
    return response.data;
  }

  async getCountries(): Promise<Countries> {
    const response = await this.apiClient.get<Countries>("/api/map/countries");
    return response.data;
  }
}
