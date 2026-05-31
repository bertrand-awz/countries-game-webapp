<script setup lang="ts">
  import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
  import { LanguagesIcon } from "@lucide/vue";
  import { useI18n } from "vue-i18n";

  import { LOCALES_OPTIONS,type SupportedLocale } from "@/app/i18n";

  const { t, locale } = useI18n();

  function changeLocale(newLocale: SupportedLocale) {
    locale.value = newLocale;
    localStorage.setItem("locale", newLocale);
  }
</script>

<template>
  <div class="md:flex md:shrink-0 md:items-center">
    <!-- Languages dropdown -->
    <Menu as="div" class="relative">
      <MenuButton class="navbar-change-language-button">
        <span class="absolute -inset-1.5"></span>
        <LanguagesIcon class="block size-6" />
      </MenuButton>

      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <MenuItems class="dropdown-menu">
          <MenuItem v-for="language in LOCALES_OPTIONS" :key="language.code" v-slot="{ active }">
            <button
              type="button"
              :class="['dropdown-item', active && 'dropdown-item-active']"
              @click="changeLocale(language.code)"
            >
              {{ t(language.labelKey) }}
            </button>
          </MenuItem>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
