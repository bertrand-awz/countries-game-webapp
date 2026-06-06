import { UseCase } from "./useCase.ts";

export class RequestGamePauseUseCase extends UseCase<void, void> {
  constructor() {
    super();
  }

  execute(): void {
    this.gameServer.pauseGame();
  }
}
