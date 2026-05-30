<script setup lang="ts">
  import { MenuIcon } from "@lucide/vue";
  import LanguagesMenu from "@/presentation/components/common/NavbarLanguagesMenu.vue";
  import { useI18n } from "vue-i18n";
  import RestartAndExitButtons from "./navbarContents/RestartAndExitButtons.vue";
  import Timer from "./navbarContents/TimerDisplayer.vue";
  import ScoreDisplayer from "./navbarContents/ScoreDisplayer.vue";

  const props = defineProps<{
    sidebarOpened: boolean;
  }>();

  defineEmits<{
    "open-sidebar": [];
  }>();

  const { t } = useI18n();
</script>

<template>
  <div class="lg:pl-72">
    <nav class="navbar sticky top-0 z-40">
      <div class="navbar-container">
        <div class="navbar-content">
          <div class="mr-4 items-center lg:hidden" :class="props.sidebarOpened ? 'hidden' : 'flex'">
            <!-- Mobile sidebar button -->
            <button
              type="button"
              class="navbar-change-language-button"
              @click="$emit('open-sidebar')"
            >
              <span class="sr-only">Open sidebar</span>
              <MenuIcon class="size-6" aria-hidden="true" />
            </button>
          </div>

          <div class="flex flex-1 items-center gap-3 md:gap-4">
            <!-- Left side -->
            <div class="flex flex-1 items-center justify-start gap-3 md:gap-4">
              <Timer
                :time-left-in-seconds="100"
                :i18n-translator="t"
                :show-timer="!props.sidebarOpened"
              />
            </div>

            <!-- Center -->
            <div class="flex flex-1 items-center justify-center">
              <ScoreDisplayer :score="5" />
            </div>

            <!-- Right side -->
            <div class="flex flex-1 items-center justify-end gap-3 md:gap-4">
              <RestartAndExitButtons :i18n-translator="t" />
              <LanguagesMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
