import { UseCase } from "../useCase.ts";
export type CountryNameAnswer = {
  countryName: string;
};
export class SubmitAnswerUseCase extends UseCase<CountryNameAnswer> {
  setOptions(options: CountryNameAnswer): this {
    this.options = options;
    return this;
  }

  execute(): void {
    // TODO: ajouter quoi executer ici à la soumission de la reponse
    this.gameServer.submitCountry(this.options?.countryName ?? "");
  }
}
