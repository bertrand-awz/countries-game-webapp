import type { GameMapApi } from "@/domain/game/ports/GameMapApi.ts";
import type { GameServer } from "@/domain/game/ports/GameServer.ts";
import type { SoundManager } from "@/domain/game/ports/SoundManager.ts";
import { axiosGameMapApi } from "@/infrastructure/game-server/api/AxiosCountriesGameMapApi.ts";
import { colyseusGameServer } from "@/infrastructure/game-server/colyseus/ColyseusGameServer.ts";
import { howlerSoundManager } from "@/infrastructure/sound/HowlerSoundManager.ts";

export abstract class UseCase<TOptions = void, TResult = void> {
  protected readonly gameServer: GameServer;
  protected readonly soundManager: SoundManager;
  protected readonly gameMapApi: GameMapApi;

  protected options?: TOptions;

  constructor() {
    this.soundManager = howlerSoundManager;
    this.gameServer = colyseusGameServer;
    this.gameMapApi = axiosGameMapApi;
  }

  setOptions(options: TOptions): this {
    this.options = options;
    return this;
  }

  abstract execute(): TResult | Promise<TResult>;
}
