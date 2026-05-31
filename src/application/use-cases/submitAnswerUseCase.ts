import { UseCase } from "./useCase.ts";
export type CountryNameAnswer = {
  countryName: string;
};
export class SubmitAnswerUseCase extends UseCase<CountryNameAnswer> {
  setOptions(options: CountryNameAnswer): this {
    return super.setOptions(options);
  }

  execute(): void {
    // TODO: ajouter quoi executer ici à la soumission de la reponse
    console.log(this.options);
  }
}
