import { UseCase } from "./useCase.ts";

export class RequestGamePauseUseCase  extends  UseCase <void, void>
{
  constructor() {
    super();
  }

  execute(): Promise<void> | void {
    return undefined;
  }
}