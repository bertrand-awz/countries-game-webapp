export type GameRestartedEvent = {
  restartedAt: number;
  currentPlayerId?: string;
  restartedByPlayerId?: string;
};
