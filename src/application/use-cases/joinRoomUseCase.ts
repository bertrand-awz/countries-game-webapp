import type { GameSession, JoinRoomOptions } from "@/domain/game/ports/GameServer.ts";

import { UseCase } from "./useCase.ts";

export class JoinRoomUseCase extends UseCase<JoinRoomOptions, GameSession> {
  constructor() {
    super();
  }

  setOptions(options: JoinRoomOptions): this {
    return super.setOptions(options);
  }

  execute(): GameSession {
    this.gameServer.joinRoom(this.options);
  }
}
