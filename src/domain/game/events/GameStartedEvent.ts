export type GameStartedEvent = {
  startAt: number;
  endAt: number;
  durationInSeconds: number;
  currentPlayerId?: string;
  startedByPlayerId?: string;
};
