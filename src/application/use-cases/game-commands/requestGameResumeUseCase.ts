import { UseCase } from "../useCase.ts";

export class RequestGameResumeUseCase extends UseCase<void, void> {
  constructor() {
    super();
  }

  execute(): void {
    this.gameCommandGateway.resumeGame();
  }
}
