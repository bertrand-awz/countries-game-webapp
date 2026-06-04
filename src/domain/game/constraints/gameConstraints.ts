type MinMaxContraints = {
  min: number;
  max: number;
};

export class GameConstraints {
  static readonly COUNTRY_NAME_MAX_LENGTH: number = 70;
  static readonly TIME_MIN_MAX_MINUTES: MinMaxContraints = { min: 10, max: 30 };
  static readonly MIN_MAX_ALLOWED_PLAYERS: MinMaxContraints = { min: 2, max: 8 };
}
