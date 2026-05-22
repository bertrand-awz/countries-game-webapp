<script setup lang="ts">
  import { MenuIcon } from "@lucide/vue";
  import LanguagesMenu from "@/components/common/NavbarLanguagesMenu.vue";
  import { useI18n } from "vue-i18n";
  import RestartAndExitButtons from "./navbarContents/RestartAndExitButtons.vue";

  defineProps<{
    userNavigation: {
      name: string;
      href: string;
    }[];
  }>();

  defineEmits<{
    "open-sidebar": [];
  }>();

  const { t } = useI18n();
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
          <RestartAndExitButtons :i18n-translator="t" />
          <LanguagesMenu />
        </div>
      </div>
    </div>
  </nav>
</template>
