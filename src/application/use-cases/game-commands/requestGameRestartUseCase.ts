import { UseCase } from "../useCase.ts";

export class RequestGameRestartUseCase extends UseCase<void, void> {
  constructor() {
    super();
  }

  execute(): void {
    this.gameCommandGateway.restartGame();
  }
}
