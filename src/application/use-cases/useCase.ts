import { appDependencies } from "@/app";
import { useGameSessionStore } from "@/application/stores/gameSessionStore.ts";
import type { GameMapApi } from "@/domain/game/ports/GameMapApi.ts";
import type { GameServer } from "@/domain/game/ports/GameServer.ts";
import type { SoundManager } from "@/domain/game/ports/SoundManager.ts";

export abstract class UseCase<TOptions = void, TResult = void> {
  protected readonly gameServer: GameServer;
  protected readonly soundManager: SoundManager;
  protected readonly gameMapApi: GameMapApi;
  protected options?: TOptions;

  constructor() {
    const { soundManager, gameMapApi, gameServer } = appDependencies;
    this.soundManager = soundManager;
    this.gameServer = gameServer;
    this.gameMapApi = gameMapApi;
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
