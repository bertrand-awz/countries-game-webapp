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
  const isConnected = ref(false);

  const players = computed(() => gameState.value?.players ?? []);
  const continents = computed(() => gameState.value?.continents ?? []);
  const status = computed(() => gameState.value?.status ?? null);
  const currentPlayer = computed(() => {
    return gameState.value?.players.find((player) => player.getId() === playerId.value) ?? null;
  });
  const isCurrentPlayerTurn = computed(() => {
    return currentTurn.value?.playerId === playerId.value;
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

  function reset(): void {
    gameState.value = null;
    roomId.value = null;
    playerId.value = null;
    currentTurn.value = null;
    isConnected.value = false;
  }

  return {
    gameState,
    roomId,
    playerId,
    isConnected,
    currentTurn,
    players,
    continents,
    status,
    currentPlayer,
    isCurrentPlayerTurn,
    setSession,
    setGameState,
    setCurrentTurn,
    clearCurrentTurn,
    reset,
  };
});
