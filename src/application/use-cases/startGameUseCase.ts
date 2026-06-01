import { UseCase } from "./useCase.ts";

export class StartGameUseCase extends UseCase<void, void> {
  constructor() {
    super();
  }
  execute() {
    this.soundManager.playMainThemeSound();
  }
}
