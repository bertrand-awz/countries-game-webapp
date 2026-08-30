function getRequiredEnvironmentVariable(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const environment = {
  gameServerUrl: getRequiredEnvironmentVariable(
    "VITE_GAME_SERVER_URL",
    import.meta.env.VITE_GAME_SERVER_URL,
  ),
};
