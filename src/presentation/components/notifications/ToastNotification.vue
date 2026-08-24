
<script setup lang="ts">
  import {
    CheckCircleIcon,
    CircleAlertIcon,
    CircleXIcon,
    InfoIcon,
    TrophyIcon,
    XIcon,
  } from "@lucide/vue";
  import { computed, onBeforeUnmount, ref, watch } from "vue";
  import { useI18n } from "vue-i18n";

  import type {
    Notification,
    NotificationAction,
    NotificationText,
    NotificationVariant,
  } from "@/domain/notification/models/Notification.ts";

  const props = defineProps<{
    notification: Notification;
  }>();

  const emit = defineEmits<{
    close: [notificationId: string];
  }>();

  const { t } = useI18n();
  const now = ref(Date.now());
  let countdownIntervalId: number | null = null;

  const variantConfig = computed(() => {
    return notificationVariantConfigs[props.notification.variant];
  });

  const countdownRemainingInSeconds = computed(() => {
    if (!props.notification.countdown) {
      return 0;
    }

    return Math.max(0, Math.ceil((props.notification.countdown.endsAt - now.value) / 1000));
  });

  const countdownPercentage = computed(() => {
    const countdown = props.notification.countdown;

    if (!countdown) {
      return 0;
    }

    const duration = countdown.endsAt - countdown.startedAt;

    if (duration <= 0) {
      return 0;
    }

    const elapsed = Math.min(duration, Math.max(0, now.value - countdown.startedAt));

    return Math.max(0, Math.min(100, 100 - (elapsed / duration) * 100));
  });

  const formattedCountdown = computed(() => {
    const minutes = Math.floor(countdownRemainingInSeconds.value / 60);
    const seconds = countdownRemainingInSeconds.value % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  });

  function resolveText(text: NotificationText): string {
    if (typeof text === "string") {
      return text;
    }

    return t(text.translationKey, text.values ?? {});
  }

  function runAction(action: NotificationAction): void {
    action.run();

    if (action.closeOnClick ?? true) {
      emit("close", props.notification.id);
    }
  }

  function refreshCountdownInterval(): void {
    if (countdownIntervalId !== null) {
      window.clearInterval(countdownIntervalId);
      countdownIntervalId = null;
    }

    if (!props.notification.countdown) {
      return;
    }

    now.value = Date.now();
    countdownIntervalId = window.setInterval(() => {
      now.value = Date.now();
    }, 250);
  }

  watch(() => props.notification.countdown, refreshCountdownInterval, { immediate: true });

  onBeforeUnmount(() => {
    if (countdownIntervalId !== null) {
      window.clearInterval(countdownIntervalId);
    }
  });

  const notificationVariantConfigs: Record<
    NotificationVariant,
    {
      icon: typeof TrophyIcon;
      accentClass: string;
      iconClass: string;
      actionClass: string;
    }
  > = {
    "game-finished": {
      icon: TrophyIcon,
      accentClass: "bg-gradient-to-b from-amber-300 via-emerald-300 to-cyan-300",
      iconClass: "bg-amber-300/10 text-amber-200 ring-amber-300/30",
      actionClass: "text-amber-200 hover:bg-amber-300/10 focus-visible:outline-amber-300",
    },
    info: {
      icon: InfoIcon,
      accentClass: "bg-cyan-300",
      iconClass: "bg-cyan-300/10 text-cyan-200 ring-cyan-300/30",
      actionClass: "text-cyan-200 hover:bg-cyan-300/10 focus-visible:outline-cyan-300",
    },
    success: {
      icon: CheckCircleIcon,
      accentClass: "bg-emerald-300",
      iconClass: "bg-emerald-300/10 text-emerald-200 ring-emerald-300/30",
      actionClass: "text-emerald-200 hover:bg-emerald-300/10 focus-visible:outline-emerald-300",
    },
    warning: {
      icon: CircleAlertIcon,
      accentClass: "bg-yellow-300",
      iconClass: "bg-yellow-300/10 text-yellow-200 ring-yellow-300/30",
      actionClass: "text-yellow-200 hover:bg-yellow-300/10 focus-visible:outline-yellow-300",
    },
    error: {
      icon: CircleXIcon,
      accentClass: "bg-red-300",
      iconClass: "bg-red-300/10 text-red-200 ring-red-300/30",
      actionClass: "text-red-200 hover:bg-red-300/10 focus-visible:outline-red-300",
    },
  };
</script>

<template>
  <div
    class="pointer-events-auto grid w-full max-w-md grid-cols-[4px_1fr] overflow-hidden rounded-lg border border-white/10 bg-neutral-950/95 text-gray-100 shadow-2xl shadow-black/40 outline-1 outline-white/10 backdrop-blur-md"
  >
    <div :class="variantConfig.accentClass" aria-hidden="true"></div>

    <div class="flex min-w-0 gap-3 p-4">
      <div
        class="flex size-10 shrink-0 items-center justify-center rounded-md ring-1"
        :class="variantConfig.iconClass"
      >
        <component :is="variantConfig.icon" class="size-5" aria-hidden="true" />
      </div>

      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold text-white">
          {{ resolveText(notification.title) }}
        </p>
        <p v-if="notification.message" class="mt-1 text-sm leading-5 text-gray-400">
          {{ resolveText(notification.message) }}
        </p>

        <div v-if="notification.countdown" class="mt-3">
          <div class="flex items-center justify-between text-xs font-semibold text-gray-400">
            <span>{{ t("GAME.NOTIFICATIONS.TURN.TIME_LEFT") }}</span>
            <span class="text-white">{{ formattedCountdown }}</span>
          </div>
          <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              class="h-full rounded-full bg-emerald-300 transition-[width] duration-200"
              :style="{ width: `${countdownPercentage}%` }"
            ></div>
          </div>
        </div>

        <div v-if="notification.actions.length > 0" class="mt-3 flex flex-wrap gap-2">
          <button
            v-for="action in notification.actions"
            :key="action.id"
            type="button"
            class="rounded-md px-2.5 py-1.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
            :class="
              action.style === 'secondary'
                ? 'text-gray-300 hover:bg-white/5 focus-visible:outline-gray-400'
                : variantConfig.actionClass
            "
            @click="runAction(action)"
          >
            {{ resolveText(action.label) }}
          </button>
        </div>
      </div>

      <button
        type="button"
        class="flex size-8 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        @click="$emit('close', notification.id)"
      >
        <span class="sr-only">{{ t("GAME.NOTIFICATIONS.CLOSE") }}</span>
        <XIcon class="size-4" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
