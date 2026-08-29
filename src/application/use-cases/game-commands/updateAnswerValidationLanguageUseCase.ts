import type { AnswerValidationLanguage } from "@/domain/shared/models/SupportedLanguage.ts";

import { UseCase } from "../useCase.ts";

export type UpdateAnswerValidationLanguageOptions = {
  language: AnswerValidationLanguage;
};

export class UpdateAnswerValidationLanguageUseCase extends UseCase<
  UpdateAnswerValidationLanguageOptions,
  void
> {
  execute(): void {
    if (!this.options) {
      throw new Error("Answer validation language is required.");
    }

    this.gameCommandGateway.updateAnswerValidationLanguage(this.options.language);
  }
}
