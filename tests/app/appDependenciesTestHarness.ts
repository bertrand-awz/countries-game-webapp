import { type AppDependencies, appDependencies } from "@/app";
import type {
  GameCommandGateway,
  GameEventGateway,
  GameRoomGateway,
} from "@/domain/game/ports/GameServer.ts";

type GameGateways = GameRoomGateway & GameCommandGateway & GameEventGateway;

export function gameGatewaysFrom(
  gameServer: GameGateways,
): Pick<AppDependencies, "gameRoomGateway" | "gameCommandGateway" | "gameEventGateway"> {
  return {
    gameRoomGateway: gameServer,
    gameCommandGateway: gameServer,
    gameEventGateway: gameServer,
  };
}

export function overrideAppDependencies(dependencies: AppDependencies): () => void {
  const previousDependencies = {
    gameRoomGateway: appDependencies.gameRoomGateway,
    gameCommandGateway: appDependencies.gameCommandGateway,
    gameEventGateway: appDependencies.gameEventGateway,
    soundManager: appDependencies.soundManager,
    gameMapApi: appDependencies.gameMapApi,
  };

  appDependencies.gameRoomGateway = dependencies.gameRoomGateway;
  appDependencies.gameCommandGateway = dependencies.gameCommandGateway;
  appDependencies.gameEventGateway = dependencies.gameEventGateway;
  appDependencies.soundManager = dependencies.soundManager;
  appDependencies.gameMapApi = dependencies.gameMapApi;

  return () => {
    appDependencies.gameRoomGateway = previousDependencies.gameRoomGateway;
    appDependencies.gameCommandGateway = previousDependencies.gameCommandGateway;
    appDependencies.gameEventGateway = previousDependencies.gameEventGateway;
    appDependencies.soundManager = previousDependencies.soundManager;
    appDependencies.gameMapApi = previousDependencies.gameMapApi;
  };
}
