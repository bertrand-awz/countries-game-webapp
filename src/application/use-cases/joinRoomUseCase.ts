import type { GameSession, JoinRoomOptions } from "@/domain/game/ports/GameServer.ts";

import { UseCase } from "./useCase.ts";

export class JoinRoomUseCase extends UseCase<JoinRoomOptions, GameSession> {
  constructor() {
    super();
  }

  setOptions(options: JoinRoomOptions): this {
    this.options = options;
    return this;
  }

  async execute(): Promise<GameSession> {
    if (!this.options) {
      throw new Error("Room joining options are required.");
    }

    const session = await this.gameRoomGateway.joinRoom(this.options);
    const gameSessionStore = this.gameSessionStore;

    gameSessionStore.setSession(session);
    this.gameEventGateway.onStateChange((gameState) => {
      gameSessionStore.setGameState(gameState);
    });
    gameSessionStore.setGameState(this.gameRoomGateway.getState());

    return session;
  }
}
