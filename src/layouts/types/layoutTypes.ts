export const layoutTypes = {
  DEFAULT: "default",
  GAME: "game",
} as const;

export type LayoutType = (typeof layoutTypes)[keyof typeof layoutTypes];