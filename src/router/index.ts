import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import GameView from "../views/GameView.vue";
import { layoutTypes } from "../layouts/types/layoutTypes";

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

export default router;
