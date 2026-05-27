export class Player {
  private readonly id: string;
  private readonly username: string;
  private score: number;
  private totalCountriesFound: number = 0;

  constructor(id: string, username: string, score = 0) {
    this.id = id;
    this.username = username;
    this.score = score;
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

  getCountriesFoundNumber():number {
    return this.totalCountriesFound;
  }
}
