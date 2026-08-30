import { appDependencies } from "@/app";
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
  protected readonly gameRoomGateway: GameRoomGateway;
  protected readonly gameCommandGateway: GameCommandGateway;
  protected readonly gameEventGateway: GameEventGateway;
  protected readonly soundManager: SoundManager;
  protected readonly gameMapApi: GameMapApi;
  protected readonly notifier: Notifier;
  protected options?: TOptions;

  constructor() {
    const {
      soundManager,
      gameMapApi,
      gameRoomGateway,
      gameCommandGateway,
      gameEventGateway,
      notifier,
    } = appDependencies;
    this.soundManager = soundManager;
    this.gameRoomGateway = gameRoomGateway;
    this.gameCommandGateway = gameCommandGateway;
    this.gameEventGateway = gameEventGateway;
    this.gameMapApi = gameMapApi;
    this.notifier = notifier;
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
