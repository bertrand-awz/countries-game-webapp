import { type AppDependencies, appDependencies } from "@/app";
import { useGameSessionStore } from "@/application/stores/gameSessionStore.ts";
import type { GameMapApi } from "@/domain/game/ports/GameMapApi.ts";
import type {
  GameCommandGateway,
  GameEventGateway,
  GameRoomGateway,
} from "@/domain/game/ports/GameServer.ts";
import type { SoundManager } from "@/domain/game/ports/SoundManager.ts";
import type { Notifier } from "@/domain/notification/ports/Notifier.ts";

export abstract class UseCase<TOptions = void, TResult = void> {
  protected options?: TOptions;

  protected get gameRoomGateway(): GameRoomGateway {
    return getConfiguredAppDependency("gameRoomGateway");
  }

  protected get gameCommandGateway(): GameCommandGateway {
    return getConfiguredAppDependency("gameCommandGateway");
  }

  protected get gameEventGateway(): GameEventGateway {
    return getConfiguredAppDependency("gameEventGateway");
  }

  protected get soundManager(): SoundManager {
    return getConfiguredAppDependency("soundManager");
  }

  protected get gameMapApi(): GameMapApi {
    return getConfiguredAppDependency("gameMapApi");
  }

  protected get notifier(): Notifier {
    return getConfiguredAppDependency("notifier");
  }

  setOptions(options: TOptions): this {
    this.options = options;
    return this;
  }

  protected get gameSessionStore() {
    return useGameSessionStore();
  }

  abstract execute(): TResult | Promise<TResult> | void;
}

function getConfiguredAppDependency<TKey extends keyof AppDependencies>(
  dependencyName: TKey,
): AppDependencies[TKey] {
  const dependency = appDependencies[dependencyName];

  if (!dependency) {
    throw new Error(
      `App dependency "${String(dependencyName)}" was used before app dependencies were configured.`,
    );
  }

  return dependency;
}
