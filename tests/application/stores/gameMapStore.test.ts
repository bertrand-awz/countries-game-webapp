import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import { createPinia, setActivePinia } from "pinia";
import { createApp } from "vue";

import type { AppDependencies } from "@/app";
import { appDependenciesKey } from "@/app/dependencies/appDependenciesKey.ts";
import { useGameMapStore } from "@/application/stores/gameMapStore.ts";
import type { Continent } from "@/domain/game/models/Continent.ts";
import type { Countries } from "@/domain/game/models/Country.ts";
import type { GameMapApi } from "@/domain/game/ports/GameMapApi.ts";

import { gameGatewaysFrom } from "../../app/appDependenciesTestHarness.ts";
import { createCountries, createCountry } from "../../domain/game/models/countryMother.ts";
import { GameServerSpy } from "../../domain/game/ports/gameServerSpy.ts";
import { SoundManagerSpy } from "../../domain/game/ports/soundManagerSpy.ts";
import { NotifierSpy } from "../../domain/notification/ports/notifierSpy.ts";

type Deferred<T> = {
  promise: Promise<T>;
  resolve(value: T): void;
  reject(reason: unknown): void;
};

function createDeferred<T>(): Deferred<T> {
  let resolvePromise: (value: T) => void = () => {};
  let rejectPromise: (reason: unknown) => void = () => {};
  const promise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  return {
    promise,
    resolve: resolvePromise,
    reject: rejectPromise,
  };
}

function createStoreContext(gameMapApi: GameMapApi) {
  const app = createApp({});
  const pinia = createPinia();
  const gameServer = new GameServerSpy();
  const dependencies: AppDependencies = {
    ...gameGatewaysFrom(gameServer),
    soundManager: new SoundManagerSpy(),
    gameMapApi,
    notifier: new NotifierSpy(),
  };

  app.use(pinia);
  app.provide(appDependenciesKey, dependencies);
  setActivePinia(pinia);

  return {
    store: useGameMapStore(),
    runInAppContext: <T>(callback: () => T) => app.runWithContext(callback),
  };
}

describe("gameMapStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("preloads continents and countries through the map API before exposing the game map as loaded", async () => {
    const continents: Continent[] = [
      {
        id: "NORTH_AMERICA",
        countriesNumber: 23,
      },
    ];
    const countries = createCountries(createCountry({ id: "CAN" }));
    const continentsDeferred = createDeferred<Continent[]>();
    const countriesDeferred = createDeferred<Countries>();
    const calls: string[] = [];
    const gameMapApi: GameMapApi = {
      getContinents: () => {
        calls.push("continents");
        return continentsDeferred.promise;
      },
      getCountries: () => {
        calls.push("countries");
        return countriesDeferred.promise;
      },
    };
    const { store, runInAppContext } = createStoreContext(gameMapApi);

    const preload = runInAppContext(() => store.preload());

    assert.equal(store.isLoading, true);
    assert.deepEqual(calls.sort(), ["continents", "countries"]);

    continentsDeferred.resolve(continents);
    countriesDeferred.resolve(countries);
    await preload;

    assert.equal(store.isLoading, false);
    assert.equal(store.isLoaded, true);
    assert.equal(store.error, null);
    assert.deepEqual(store.continents, continents);
    assert.deepEqual(store.countries, countries);
  });

  it("does not call the map API again while a preload is already running or after data is loaded", async () => {
    const continentsDeferred = createDeferred<Continent[]>();
    const countriesDeferred = createDeferred<Countries>();
    let continentsCallCount = 0;
    let countriesCallCount = 0;
    const gameMapApi: GameMapApi = {
      getContinents: () => {
        continentsCallCount++;
        return continentsDeferred.promise;
      },
      getCountries: () => {
        countriesCallCount++;
        return countriesDeferred.promise;
      },
    };
    const { store, runInAppContext } = createStoreContext(gameMapApi);

    const firstPreload = runInAppContext(() => store.preload());
    await runInAppContext(() => store.preload());

    assert.equal(continentsCallCount, 1);
    assert.equal(countriesCallCount, 1);

    continentsDeferred.resolve([]);
    countriesDeferred.resolve(createCountries());
    await firstPreload;
    await runInAppContext(() => store.preload());

    assert.equal(continentsCallCount, 1);
    assert.equal(countriesCallCount, 1);
  });

  it("returns to an empty unloaded map when the API cannot provide the map data", async () => {
    const error = new Error("network unavailable");
    const gameMapApi: GameMapApi = {
      getContinents: async () => {
        throw error;
      },
      getCountries: async () => createCountries(createCountry({ id: "CAN" })),
    };
    const { store, runInAppContext } = createStoreContext(gameMapApi);

    await assert.rejects(
      runInAppContext(() => store.preload()),
      error,
    );

    assert.equal(store.isLoading, false);
    assert.equal(store.isLoaded, false);
    assert.equal(store.error, "Unable to load game map data");
    assert.deepEqual(store.continents, []);
    assert.deepEqual(store.countries, createCountries());
  });
});
