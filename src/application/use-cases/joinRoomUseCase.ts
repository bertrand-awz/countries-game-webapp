import type { GameSession, JoinRoomOptions } from "@/domain/game/ports/GameServer.ts";

import { UseCase } from "./useCase.ts";

export class JoinRoomUseCase extends UseCase<JoinRoomOptions, GameSession | void> {
  constructor() {
    super();
  }

  setOptions(options: JoinRoomOptions): this {
    this.options = options;
    return this;
  }

  async execute(): Promise<GameSession | void> {
    if (this.options) return await this.gameServer.joinRoom(this.options);
    return;
  }
}
