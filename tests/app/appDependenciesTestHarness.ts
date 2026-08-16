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

export function overrideAppDependencies(dependencies: Partial<AppDependencies>): () => void {
  const previousDependencies = {
    gameRoomGateway: appDependencies.gameRoomGateway,
    gameCommandGateway: appDependencies.gameCommandGateway,
    gameEventGateway: appDependencies.gameEventGateway,
    soundManager: appDependencies.soundManager,
    gameMapApi: appDependencies.gameMapApi,
    notifier: appDependencies.notifier,
  };

  appDependencies.gameRoomGateway = dependencies.gameRoomGateway ?? appDependencies.gameRoomGateway;
  appDependencies.gameCommandGateway =
    dependencies.gameCommandGateway ?? appDependencies.gameCommandGateway;
  appDependencies.gameEventGateway = dependencies.gameEventGateway ?? appDependencies.gameEventGateway;
  appDependencies.soundManager = dependencies.soundManager ?? appDependencies.soundManager;
  appDependencies.gameMapApi = dependencies.gameMapApi ?? appDependencies.gameMapApi;
  appDependencies.notifier = dependencies.notifier ?? appDependencies.notifier;

  return () => {
    appDependencies.gameRoomGateway = previousDependencies.gameRoomGateway;
    appDependencies.gameCommandGateway = previousDependencies.gameCommandGateway;
    appDependencies.gameEventGateway = previousDependencies.gameEventGateway;
    appDependencies.soundManager = previousDependencies.soundManager;
    appDependencies.gameMapApi = previousDependencies.gameMapApi;
    appDependencies.notifier = previousDependencies.notifier;
  };
}
