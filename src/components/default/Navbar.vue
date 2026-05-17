<script setup lang="ts">
  import { ref } from "vue";
  import { RouterLink } from "vue-router";
  import { useI18n } from "vue-i18n";

  const { t, locale } = useI18n();

  const isMenuOpen = ref(false);

  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value;
  }

  function closeMenu() {
    isMenuOpen.value = false;
  }

  function changeLanguage(newLocale: "fr" | "en") {
    locale.value = newLocale;
    localStorage.setItem("locale", newLocale);
  }
</script>

<template>
  <nav
    class="fixed inset-s-0 top-0 z-20 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur"
  >
    <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between p-4">
      <RouterLink to="/" class="flex items-center space-x-3" @click="closeMenu">
        <img src="/favicon.ico" class="h-8 w-8" alt="Naming Countries Game logo" />

        <span class="self-center text-xl font-semibold whitespace-nowrap text-white">
          {{ t("app.name") }}
        </span>
      </RouterLink>

      <div class="flex items-center gap-3 md:order-2">
        <RouterLink
          to="/play"
          class="rounded-lg border border-transparent bg-emerald-500 px-4 py-2 text-sm leading-5 font-medium text-white shadow-sm transition hover:bg-emerald-400 focus:ring-4 focus:ring-emerald-500/30 focus:outline-none"
          @click="closeMenu"
        >
          {{ t("app.play") }}
        </RouterLink>

        <select
          :value="locale"
          class="hidden rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 sm:block"
          @change="changeLanguage(($event.target as HTMLSelectElement).value as 'fr' | 'en')"
        >
          <option value="fr">{{ t("language.fr") }}</option>
          <option value="en">{{ t("language.en") }}</option>
        </select>

        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white focus:ring-2 focus:ring-slate-600 focus:outline-none md:hidden"
          aria-controls="navbar-menu"
          :aria-expanded="isMenuOpen"
          @click="toggleMenu"
        >
          <span class="sr-only">Open main menu</span>

          <svg
            v-if="!isMenuOpen"
            class="h-6 w-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="2"
              d="M5 7h14M5 12h14M5 17h14"
            />
          </svg>

          <svg
            v-else
            class="h-6 w-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="2"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div
        id="navbar-menu"
        class="w-full items-center justify-between md:order-1 md:flex md:w-auto"
        :class="isMenuOpen ? 'block' : 'hidden'"
      >
        <ul
          class="mt-4 flex flex-col rounded-lg border border-slate-800 bg-slate-900 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-transparent md:p-0"
        >
          <li>
            <RouterLink
              to="/"
              class="block rounded px-3 py-2 text-slate-200 transition hover:bg-slate-800 hover:text-emerald-400 md:p-0 md:hover:bg-transparent"
              active-class="bg-emerald-500 text-white md:bg-transparent md:text-emerald-400"
              @click="closeMenu"
            >
              {{ t("app.home") }}
            </RouterLink>
          </li>

          <li>
            <RouterLink
              to="/help"
              class="block rounded px-3 py-2 text-slate-200 transition hover:bg-slate-800 hover:text-emerald-400 md:p-0 md:hover:bg-transparent"
              active-class="bg-emerald-500 text-white md:bg-transparent md:text-emerald-400"
              @click="closeMenu"
            >
              {{ t("app.help") }}
            </RouterLink>
          </li>

          <li class="sm:hidden">
            <label class="mt-2 block px-3 text-sm text-slate-400"> Langue </label>

            <select
              :value="locale"
              class="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
              @change="changeLanguage(($event.target as HTMLSelectElement).value as 'fr' | 'en')"
            >
              <option value="fr">{{ t("language.fr") }}</option>
              <option value="en">{{ t("language.en") }}</option>
            </select>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
