import type { Continent } from "@/domain/game/models/Continent.ts";

import { UseCase } from "./useCase.ts";

export class LoadContinentsUseCase extends UseCase<void, Continent[]> {
  constructor() {
    super();
  }

  execute(): Continent[] {
    return [
      {
        id: "AFRICA",
        countriesNumber: 54,
      },
      {
        id: "EUROPE",
        countriesNumber: 44,
      },
      {
        id: "ASIA",
        countriesNumber: 48,
      },
    ];
  }
}
