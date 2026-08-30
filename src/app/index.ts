import type { GameMapApi } from "@/domain/game/ports/GameMapApi.ts";
import type {
  GameCommandGateway,
  GameEventGateway,
  GameRoomGateway,
} from "@/domain/game/ports/GameServer.ts";
import type { SoundManager } from "@/domain/game/ports/SoundManager.ts";
import type { Notifier } from "@/domain/notification/ports/Notifier.ts";
import { AxiosGameMapApi } from "@/infrastructure/game-server/api/AxiosCountriesGameMapApi.ts";
import { ColyseusGameCommandGateway } from "@/infrastructure/game-server/colyseus/ColyseusGameCommandGateway.ts";
import { ColyseusGameEventGateway } from "@/infrastructure/game-server/colyseus/ColyseusGameEventGateway.ts";
import { ColyseusRoomGateway } from "@/infrastructure/game-server/colyseus/ColyseusRoomGateway.ts";
import { ToastNotifier } from "@/infrastructure/notification/ToastNotifier.ts";
import { HowlerSoundManager } from "@/infrastructure/sound/HowlerSoundManager.ts";

export type AppDependencies = {
  gameRoomGateway: GameRoomGateway;
  gameCommandGateway: GameCommandGateway;
  gameEventGateway: GameEventGateway;
  soundManager: SoundManager;
  gameMapApi: GameMapApi;
  notifier: Notifier;
};

type AppConfig = {
  gameServerUrl: string;
};

export const appDependencies = {} as AppDependencies;

export function createAppDependencies(config: AppConfig): AppDependencies {
  const colyseusRoomGateway = new ColyseusRoomGateway(config.gameServerUrl);

  return {
    gameRoomGateway: colyseusRoomGateway,
    gameCommandGateway: new ColyseusGameCommandGateway(colyseusRoomGateway),
    gameEventGateway: new ColyseusGameEventGateway(colyseusRoomGateway),
    soundManager: new HowlerSoundManager(),
    gameMapApi: new AxiosGameMapApi(config.gameServerUrl),
    notifier: new ToastNotifier(),
  };
}

export function configureAppDependencies(dependencies: AppDependencies): void {
  Object.assign(appDependencies, dependencies);
}
