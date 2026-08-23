export type GameResumedEvent = {
  resumedAt: number;
  endAt: number;
  resumedByPlayerId?: string;
};
