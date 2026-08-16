import { GameFinishedReaction } from "@/application/reactions/game/GameFinishedReaction.ts";
import type { Unsubscribe } from "@/domain/game/ports/GameServer.ts";

import { UseCase } from "./useCase.ts";

export class RegisterGameEventReactionsUseCase extends UseCase<void, void> {
  private readonly gameFinishedReaction: GameFinishedReaction;
  private unsubscriptions: Unsubscribe[] = [];

  constructor() {
    super();
    this.gameFinishedReaction = new GameFinishedReaction(this.notifier);
  }

  execute(): void {
    this.clearSubscriptions();

    this.unsubscriptions = [
      this.gameEventGateway.onGameFinished(() => {
        this.gameFinishedReaction.handle();
      }),
    ];
  }

  clearSubscriptions(): void {
    this.unsubscriptions.forEach((unsubscribe) => unsubscribe());
    this.unsubscriptions = [];
  }
}
