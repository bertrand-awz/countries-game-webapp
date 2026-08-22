import { defineStore } from "pinia";
import { computed, ref, shallowRef } from "vue";

import type { GameState } from "@/domain/game/models/state/GameState";

type CurrentTurn = {
  playerId: string;
  startedAt: number;
  durationInSeconds: number;
};

export const useGameSessionStore = defineStore("gameSession", () => {
  const gameState = shallowRef<GameState | null>(null);
  const roomId = ref<string | null>(null);
  const playerId = ref<string | null>(null);
  const currentTurn = shallowRef<CurrentTurn | null>(null);
  const highlightedCountryId = ref<string | null>(null);
  const foundCountryIds = ref<string[]>([]);
  const isConnected = ref(false);

  const players = computed(() => gameState.value?.players ?? []);
  const waitingPlayers = computed(() => gameState.value?.waitingPlayers ?? []);
  const continents = computed(() => gameState.value?.continents ?? []);
  const status = computed(() => gameState.value?.status ?? null);
  const currentPlayer = computed(() => {
    return gameState.value?.players.find((player) => player.getId() === playerId.value) ?? null;
  });
  const isCurrentPlayerTurn = computed(() => {
    return currentTurn.value?.playerId === playerId.value;
  });
  const currentWaitingPlayer = computed(() => {
    return waitingPlayers.value.find((player) => player.id === playerId.value) ?? null;
  });

  function setSession(session: { roomId: string; playerId: string }): void {
    roomId.value = session.roomId;
    playerId.value = session.playerId;
    isConnected.value = true;
  }

  function setGameState(newGameState: GameState): void {
    gameState.value = newGameState;
  }

  function setCurrentTurn(newCurrentTurn: CurrentTurn): void {
    currentTurn.value = newCurrentTurn;
  }

  function clearCurrentTurn(): void {
    currentTurn.value = null;
  }

  function highlightCountry(countryId: string): void {
    highlightedCountryId.value = countryId;
  }

  function recordCountryFound(countryId: string): void {
    if (!foundCountryIds.value.includes(countryId)) {
      foundCountryIds.value = [...foundCountryIds.value, countryId];
    }

    highlightCountry(countryId);
  }

  function clearHighlightedCountry(): void {
    highlightedCountryId.value = null;
  }

  function clearFoundCountries(): void {
    foundCountryIds.value = [];
    clearHighlightedCountry();
  }

  function reset(): void {
    gameState.value = null;
    roomId.value = null;
    playerId.value = null;
    currentTurn.value = null;
    highlightedCountryId.value = null;
    foundCountryIds.value = [];
    isConnected.value = false;
  }

  return {
    gameState,
    roomId,
    playerId,
    isConnected,
    currentTurn,
    highlightedCountryId,
    foundCountryIds,
    players,
    waitingPlayers,
    continents,
    status,
    currentPlayer,
    currentWaitingPlayer,
    isCurrentPlayerTurn,
    setSession,
    setGameState,
    setCurrentTurn,
    clearCurrentTurn,
    highlightCountry,
    recordCountryFound,
    clearHighlightedCountry,
    clearFoundCountries,
    reset,
  };
});
