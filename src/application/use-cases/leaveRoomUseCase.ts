import { CURRENT_TURN_NOTIFICATION_ID } from "@/application/reactions/game/GameTurnChangedReaction.ts";

import { RegisterGameEventReactionsUseCase } from "./registerGameEventReactionsUseCase.ts";
import { UseCase } from "./useCase.ts";

type GameEventReactionsRegistry = Pick<RegisterGameEventReactionsUseCase, "clearSubscriptions">;

export class LeaveRoomUseCase extends UseCase<void, Promise<void>> {
  constructor(
    private readonly gameEventReactionsRegistry: GameEventReactionsRegistry = new RegisterGameEventReactionsUseCase(),
  ) {
    super();
  }

  async execute(): Promise<void> {
    await this.gameRoomGateway.leaveRoom();
    this.gameEventReactionsRegistry.clearSubscriptions();
    this.notifier.dismiss(CURRENT_TURN_NOTIFICATION_ID);
    this.gameSessionStore.reset();
  }
}
