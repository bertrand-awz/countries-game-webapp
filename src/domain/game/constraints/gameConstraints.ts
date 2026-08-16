type MinMaxContraints = {
  min: number;
  max: number;
};

export class GameConstraints {
  static readonly COUNTRY_NAME_MAX_LENGTH: number = 70;
  static readonly ALLOWED_TIME_IN_MINUTES: MinMaxContraints = { min: 2, max: 10 };
  static readonly ALLOWED_PLAYERS_NUMBER: MinMaxContraints = { min: 2, max: 8 };
  static readonly ALLOWED_TURN_TIME_IN_SECONDS: MinMaxContraints & { default: number } = {
    min: 30,
    max: 55,
    default: 45,
  };
}
