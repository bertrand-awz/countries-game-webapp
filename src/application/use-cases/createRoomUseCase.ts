import type { CreateRoomOptions, GameSession } from "@/domain/game/ports/GameServer.ts";

import { UseCase } from "./useCase.ts";

export class CreateRoomUseCase extends UseCase<CreateRoomOptions, GameSession> {
  constructor() {
    super();
  }

  setOptions(options: CreateRoomOptions): this {
    this.options = options;
    return this;
  }

  async execute(): Promise<GameSession> {
    if (!this.options) {
      throw new Error("Room creation options are required.");
    }

    const session = await this.gameServer.createRoom(this.options);
    const gameSessionStore = this.gameSessionStore;

    gameSessionStore.setSession(session);
    this.gameServer.onStateChange((gameState) => {
      gameSessionStore.setGameState(gameState);
    });
    gameSessionStore.setGameState(this.gameServer.getState());

    return session;
  }
}
