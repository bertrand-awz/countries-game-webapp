export type GameActionVote = "pause" | "resume" | "restart";

export type GameActionVoteRequestedEvent = {
  requestId: string;
  action: GameActionVote;
  requestedByPlayerId: string;
  requestedByUsername: string;
  requiredVoterIds: string[];
};
