<script setup lang="ts">
  import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
  import { Gamepad2Icon, MenuIcon, XIcon } from "@lucide/vue";
  import { useI18n } from "vue-i18n";

  import { LOCALES_OPTIONS, type SupportedLocale } from "@/app/i18n";
  import GameIcon from "@/assets/icons/gameIcon.svg";
  import LanguagesMenu from "@/presentation/components/partials/NavbarLanguagesMenu.vue";

  const { t, locale } = useI18n();

  function changeLocale(newLocale: SupportedLocale) {
    locale.value = newLocale;
    localStorage.setItem("locale", newLocale);
  }

  type NavigationItem = {
    name: string;
    href: string;
    current?: boolean;
  };

  const navigation: NavigationItem[] = [];
</script>

<template>
  <Disclosure v-slot="{ open }" as="nav" class="navbar">
    <div class="navbar-container">
      <div class="navbar-content">
        <div class="flex">
          <!-- Logo -->
          <div class="flex shrink-0 items-center">
            <GameIcon class="size-9" alt="Name countries game logo" aria-hidden="true" />
          </div>

          <!-- Desktop navigation -->
          <div class="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <a
              v-for="item in navigation"
              :key="item.name"
              :href="item.href"
              :class="['navbar-link navbar-link-desktop', item.current && 'navbar-link-active']"
              :aria-current="item.current ? 'page' : undefined"
            >
              {{ item.name }}
            </a>
          </div>
        </div>

        <div class="flex items-center gap-2 md:gap-4">
          <!-- Action button -->
          <div class="flex shrink-0">
            <RouterLink to="/play" class="navbar-action-button">
              <Gamepad2Icon class="size-5" aria-hidden="true" />
              {{ t("APP.START_GAME") }}
            </RouterLink>
          </div>

          <!-- Mobile menu button -->
          <div class="flex items-center md:hidden">
            <DisclosureButton class="navbar-mobile-button">
              <span class="absolute -inset-0.5"></span>
              <MenuIcon v-if="!open" class="block size-6" aria-hidden="true" />
              <XIcon v-else class="block size-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
          <LanguagesMenu />
        </div>
      </div>
    </div>

    <!-- Mobile panel -->
    <DisclosurePanel class="mobile-panel">
      <div class="mobile-panel-section">
        <DisclosureButton
          v-for="item in navigation"
          :key="item.name"
          as="a"
          :href="item.href"
          :class="['navbar-link navbar-link-mobile', item.current && 'navbar-link-active']"
          :aria-current="item.current ? 'page' : undefined"
        >
          {{ item.name }}
        </DisclosureButton>
      </div>

      <div class="border-t border-white/10 pt-4 pb-3">
        <div class="flex items-center px-5 sm:px-6">
          <div class="text-base font-medium text-white">
            {{ t("APP.SUPPORTED_LANGUAGES") }}
          </div>
        </div>

        <div class="mt-3 space-y-1 px-2 sm:px-3">
          <DisclosureButton
            v-for="language in LOCALES_OPTIONS"
            :key="language.code"
            as="button"
            class="mobile-menu-item"
            @click="changeLocale(language.code)"
          >
            {{ t(language.labelKey) }}
          </DisclosureButton>
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
