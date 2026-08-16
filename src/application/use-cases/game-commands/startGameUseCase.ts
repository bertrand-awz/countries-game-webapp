import { UseCase } from "../useCase.ts";

export class StartGameUseCase extends UseCase<void, void> {
  constructor() {
    super();
  }

  execute(): void {
    this.gameServer.startGame();
  }
}
