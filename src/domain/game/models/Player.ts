import type { AnswerValidationLanguage } from "@/domain/shared/models/SupportedLanguage.ts";

export class Player {
  private readonly id: string;
  private readonly username: string;
  private score: number;
  private totalCountriesFound: number = 0;
  private answerValidationLanguage: AnswerValidationLanguage;
  private colorSlot: number;

  constructor(
    id: string,
    username: string,
    score = 0,
    answerValidationLanguage: AnswerValidationLanguage = "any",
    colorSlot = 0,
  ) {
    this.id = id;
    this.username = username;
    this.score = score;
    this.answerValidationLanguage = answerValidationLanguage;
    this.colorSlot = colorSlot;
  }

  getId(): string {
    return this.id;
  }

  getUsername(): string {
    return this.username;
  }

  getScore(): number {
    return this.score;
  }

  updateScore(newScore: number) {
    this.score = newScore;
  }

  updateTotalCountriesFound(countriesFound: number) {
    this.totalCountriesFound = countriesFound;
  }

  getCountriesFoundNumber(): number {
    return this.totalCountriesFound;
  }

  getAnswerValidationLanguage(): AnswerValidationLanguage {
    return this.answerValidationLanguage;
  }

  updateAnswerValidationLanguage(language: AnswerValidationLanguage) {
    this.answerValidationLanguage = language;
  }

  getColorSlot(): number {
    return this.colorSlot;
  }

  updateColorSlot(colorSlot: number) {
    this.colorSlot = colorSlot;
  }
}
