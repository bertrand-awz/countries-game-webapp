<script setup lang="ts">
  import { Cog6ToothIcon } from "@heroicons/vue/24/outline";
  import GameIcon from "@/assets/icons/gameIcon.svg";
  import { useI18n } from "vue-i18n";

  const { t } = useI18n();

  defineProps<{
    navigation: {
      name: string;
      href: string;
      icon: unknown;
      current: boolean;
    }[];
    teams: {
      id: number;
      name: string;
      href: string;
      initial: string;
      current: boolean;
    }[];
  }>();

  function getNavigationItemClasses(current: boolean) {
    return [
      current
        ? "bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white"
        : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
      "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
    ];
  }

  function getNavigationIconClasses(current: boolean) {
    return [
      current
        ? "text-indigo-600 dark:text-white"
        : "text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white",
      "size-6 shrink-0",
    ];
  }

  function getTeamInitialClasses(current: boolean) {
    return [
      current
        ? "border-indigo-600 text-indigo-600 dark:border-white/20 dark:text-white"
        : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 dark:border-white/10 dark:group-hover:border-white/20 dark:group-hover:text-white",
      "flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium dark:bg-white/5",
    ];
  }
</script>

<template>
  <div class="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
    <div class="flex h-16 shrink-0 items-center gap-2">
      <GameIcon class="size-10" />
      <div>
        <h1 class="text-l font-bold text-white">
          {{ t("APP.NAME") }}
        </h1>
      </div>
    </div>

    <nav class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" class="-mx-2 space-y-1">
            <li v-for="item in navigation" :key="item.name">
              <a :href="item.href" :class="getNavigationItemClasses(item.current)">
                <component
                  :is="item.icon"
                  :class="getNavigationIconClasses(item.current)"
                  aria-hidden="true"
                />

                {{ item.name }}
              </a>
            </li>
          </ul>
        </li>

        <li>
          <div class="text-xs/6 font-semibold text-gray-400">Your teams</div>

          <ul role="list" class="-mx-2 mt-2 space-y-1">
            <li v-for="team in teams" :key="team.id">
              <a :href="team.href" :class="getNavigationItemClasses(team.current)">
                <span :class="getTeamInitialClasses(team.current)">
                  {{ team.initial }}
                </span>

                <span class="truncate">
                  {{ team.name }}
                </span>
              </a>
            </li>
          </ul>
        </li>

        <li class="mt-auto">
          <a
            href="#"
            class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <Cog6ToothIcon
              class="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white"
              aria-hidden="true"
            />

            Settings
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>
