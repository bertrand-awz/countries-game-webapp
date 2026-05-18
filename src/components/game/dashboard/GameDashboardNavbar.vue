<script setup lang="ts">
  import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

  import { ChevronDownIcon, MenuIcon, SearchIcon } from "@lucide/vue";

  import GameIcon from "@/assets/icons/gameIcon.svg";
  import LanguagesMenu from "@/components/common/NavbarLanguagesMenu.vue";

  defineProps<{
    userNavigation: {
      name: string;
      href: string;
    }[];
  }>();

  defineEmits<{
    "open-sidebar": [];
  }>();
</script>

<template>
  <nav class="navbar sticky top-0 z-40">
    <div class="navbar-container">
      <div class="navbar-content">
        <div class="flex items-center gap-4">
          <!-- Mobile sidebar button -->
          <button
            type="button"
            class="navbar-mobile-button lg:hidden"
            @click="$emit('open-sidebar')"
          >
            <span class="sr-only">Open sidebar</span>
            <MenuIcon class="size-6" aria-hidden="true" />
          </button>
        </div>

        <div class="flex flex-1 items-center justify-end gap-3 md:gap-4">
          <!-- Search -->
          <form class="hidden max-w-md flex-1 md:grid md:grid-cols-1" action="#" method="GET">
            <input
              name="search"
              aria-label="Search"
              class="col-start-1 row-start-1 block size-full rounded-md border border-white/10 bg-white/10 py-2 pr-3 pl-9 text-sm text-white outline-none placeholder:text-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
              placeholder="Search"
            />

            <SearchIcon
              class="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
              aria-hidden="true"
            />
          </form>

          <!-- User dropdown -->
          <LanguagesMenu />
        </div>
      </div>
    </div>
  </nav>
</template>
