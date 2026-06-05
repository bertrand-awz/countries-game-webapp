import { createRouter, createWebHistory } from "vue-router";

import { appDependencies } from "@/app";
import { layoutTypes } from "@/app/layouts/types/layoutTypes.ts";
import GameFormView from "@/presentation/views/GameFormView.vue";
import GameView from "@/presentation/views/GameView.vue";
import HomeView from "@/presentation/views/HomeView.vue";

import { RouteName } from "./routeName.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: RouteName.HOME,
      component: HomeView,
      meta: {
        layout: layoutTypes.DEFAULT,
      },
    },
    {
      path: "/play",
      name: RouteName.GAME,
      component: GameView,
      meta: {
        requiresRoom: true,
        layout: layoutTypes.GAME,
      },
    },
    {
      path: "/create-room",
      name: RouteName.GAME_ROOM_CREATION,
      component: GameFormView,
      meta: {
        layout: layoutTypes.GAME_FORM,
        joiningRoom: false,
      },
    },
    {
      path: "/join",
      name: RouteName.GAME_ROOM_MANUAL_JOINING,
      component: GameFormView,
      meta: {
        layout: layoutTypes.GAME_FORM,
        joiningRoom: true,
        manualRoomIdInputAllowed: true,
      },
    },
    {
      path: "/join/:roomId",
      name: RouteName.GAME_ROOM_AUTOMATIC_JOINING,
      component: GameFormView,
      meta: {
        layout: layoutTypes.GAME_FORM,
        joiningRoom: true,
        manualRoomIdInputAllowed: false,
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: RouteName.NOT_FOUND,
      component: HomeView,
      meta: {
        layout: layoutTypes.DEFAULT,
      },
    },
  ],
});

router.beforeEach((to) => {
  if (to.meta.requiresRoom && !appDependencies.gameServer.hasActiveRoom()) {
    return { name: RouteName.GAME_ROOM_CREATION };
  }
});

export default router;
