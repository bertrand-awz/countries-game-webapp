import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createFoundingContinentProgressiveStatesForContinents } from "@/domain/game/models/state/FoundingContinentProgressionState.ts";

describe("createFoundingContinentProgressiveStatesForContinents", () => {
  it("starts every selected continent with no country found so a new game begins from a neutral progression", () => {
    const northAmerica = {
      id: "NORTH_AMERICA" as const,
      countriesNumber: 23,
    };
    const europe = {
      id: "EUROPE" as const,
      countriesNumber: 44,
    };

    const progression = createFoundingContinentProgressiveStatesForContinents([
      northAmerica,
      europe,
    ]);

    assert.deepEqual(progression, [
      {
        continent: northAmerica,
        countriesFoundNumber: 0,
      },
      {
        continent: europe,
        countriesFoundNumber: 0,
      },
    ]);
  });
});
