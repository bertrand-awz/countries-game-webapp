import { createRouter, createWebHistory } from "vue-router";

import { appDependencies } from "@/app";
import { layoutTypes } from "@/app/layouts/types/layoutTypes.ts";
import GameFormView from "@/presentation/views/GameFormView.vue";
import GameView from "@/presentation/views/GameView.vue";
import HomeView from "@/presentation/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        layout: layoutTypes.DEFAULT,
      },
    },
    {
      path: "/play",
      name: "game",
      component: GameView,
      meta: {
        requiresRoom: true,
        layout: layoutTypes.GAME,
      },
    },
    {
      path: "/lobby",
      name: "lobby",
      component: GameFormView,
      meta: {
        layout: layoutTypes.GAME_FORM,
      },
    },
    {
      path: "/join",
      redirect: "/lobby",
    },
    {
      path: "/join/:roomId",
      name: "join-room",
      component: GameFormView,
      meta: {
        layout: layoutTypes.GAME_FORM,
        joiningRoom: true,
      },
    },
  ],
});

router.beforeEach((to) => {
  if (to.meta.requiresRoom && !appDependencies.gameServer.hasActiveRoom()) {
    return { name: "lobby" };
  }
});

export default router;
