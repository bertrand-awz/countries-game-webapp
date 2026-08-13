import { type AppDependencies, appDependencies } from "@/app";

export function overrideAppDependencies(dependencies: AppDependencies): () => void {
  const previousDependencies = {
    gameServer: appDependencies.gameServer,
    soundManager: appDependencies.soundManager,
    gameMapApi: appDependencies.gameMapApi,
  };

  appDependencies.gameServer = dependencies.gameServer;
  appDependencies.soundManager = dependencies.soundManager;
  appDependencies.gameMapApi = dependencies.gameMapApi;

  return () => {
    appDependencies.gameServer = previousDependencies.gameServer;
    appDependencies.soundManager = previousDependencies.soundManager;
    appDependencies.gameMapApi = previousDependencies.gameMapApi;
  };
}
