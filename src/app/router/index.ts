import { createRouter, createWebHistory } from "vue-router";

import { appDependencies } from "@/app";
import { layoutTypes } from "@/app/layouts/types/layoutTypes.ts";
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
        layout: layoutTypes.GAME,
      },
    },
  ],
});

router.beforeEach((to) => {
  if (to.meta.requiresRoom && !appDependencies.gameServer.hasActiveRoom()) {
    return { name: "home" };
  }
});
export default router;
