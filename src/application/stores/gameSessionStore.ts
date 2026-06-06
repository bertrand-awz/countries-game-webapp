import { defineStore } from "pinia";
import { computed, ref, shallowRef } from "vue";

import type { GameState } from "@/domain/game/models/state/GameState";

export const useGameSessionStore = defineStore("gameSession", () => {
  const gameState = shallowRef<GameState | null>(null);
  const roomId = ref<string | null>(null);
  const playerId = ref<string | null>(null);
  const isConnected = ref(false);

  const players = computed(() => gameState.value?.players ?? []);
  const continents = computed(() => gameState.value?.continents ?? []);
  const status = computed(() => gameState.value?.status ?? null);
  const currentPlayer = computed(() => {
    return gameState.value?.players.find((player) => player.getId() === playerId.value) ?? null;
  });

  function setSession(session: { roomId: string; playerId: string }): void {
    roomId.value = session.roomId;
    playerId.value = session.playerId;
    isConnected.value = true;
  }

  function setGameState(newGameState: GameState): void {
    gameState.value = newGameState;
  }

  function reset(): void {
    gameState.value = null;
    roomId.value = null;
    playerId.value = null;
    isConnected.value = false;
  }

  return {
    gameState,
    roomId,
    playerId,
    isConnected,
    players,
    continents,
    status,
    currentPlayer,
    setSession,
    setGameState,
    reset,
  };
});
