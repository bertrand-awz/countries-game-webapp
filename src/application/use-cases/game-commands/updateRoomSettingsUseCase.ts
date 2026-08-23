import type { GameSetting } from "@/domain/game/settings";

import { UseCase } from "../useCase.ts";

export class UpdateRoomSettingsUseCase extends UseCase<GameSetting, void> {
  constructor() {
    super();
  }

  execute(): void {
    if (!this.options) {
      throw new Error("Room settings are required.");
    }

    this.gameCommandGateway.updateRoomSettings({
      maxPlayersAllowed: this.options.maxPlayersAllowed,
      gameDurationInSeconds: this.options.durationInMinutes * 60,
      turnDurationInSeconds: this.options.turnDurationInSeconds,
    });
  }
}
