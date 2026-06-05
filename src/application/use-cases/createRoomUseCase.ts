import type { CreateRoomOptions, GameSession } from "@/domain/game/ports/GameServer.ts";

import { UseCase } from "./useCase.ts";

export class CreateRoomUseCase extends UseCase<CreateRoomOptions, GameSession | void> {
  constructor() {
    super();
  }

  setOptions(options: CreateRoomOptions): this {
    this.options = options;
    return this;
  }

  async execute(): Promise<GameSession | void> {
    if (this.options) return await this.gameServer.createRoom(this.options);
    return;
  }
}
