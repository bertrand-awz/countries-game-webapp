export type PlayerLeftRoomEvent = {
  playerId: string;
  username: string;
  numberOfPlayers: number;
  code?: number;
};
