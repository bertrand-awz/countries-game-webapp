import type { GameMapApi } from "@/domain/game/ports/GameMapApi.ts";
import type { GameServer } from "@/domain/game/ports/GameServer.ts";
import type { SoundManager } from "@/domain/game/ports/SoundManager.ts";
import { AxiosGameMapApi } from "@/infrastructure/game-server/api/AxiosCountriesGameMapApi.ts";
import { ColyseusGameServer } from "@/infrastructure/game-server/colyseus/ColyseusGameServer.ts";
import { HowlerSoundManager } from "@/infrastructure/sound/HowlerSoundManager.ts";

export type AppDependencies = {
  gameServer: GameServer;
  soundManager: SoundManager;
  gameMapApi: GameMapApi;
};

export const appDependencies: AppDependencies = {
  gameServer: new ColyseusGameServer(),
  soundManager: new HowlerSoundManager(),
  gameMapApi: new AxiosGameMapApi(),
};
