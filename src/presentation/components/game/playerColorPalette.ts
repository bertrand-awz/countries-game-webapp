const PLAYER_COLORS = [
  "#facc15",
  "#22d3ee",
  "#fb7185",
  "#34d399",
  "#a78bfa",
  "#f97316",
  "#60a5fa",
  "#f472b6",
] as const;

export function getPlayerColor(colorSlot: number): string {
  const normalizedSlot = Math.abs(Math.trunc(colorSlot)) % PLAYER_COLORS.length;

  return PLAYER_COLORS[normalizedSlot];
}

export function getPlayerColorBulletStyle(colorSlot: number): Record<string, string> {
  const color = getPlayerColor(colorSlot);

  return {
    backgroundColor: color,
    boxShadow: `0 0 0 2px ${color}33`,
  };
}
