<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";

  type CountDirection = "up" | "down";

  const props = withDefaults(
    defineProps<{
      to: number;
      from?: number;
      direction?: CountDirection;
      delay?: number;
      duration?: number;
      className?: string;
      startWhen?: boolean;
      separator?: string;
      onStart?: () => void;
      onEnd?: () => void;
    }>(),
    {
      from: 0,
      direction: "up",
      delay: 0,
      duration: 2,
      className: "",
      startWhen: true,
      separator: "",
      onStart: undefined,
      onEnd: undefined,
    },
  );

  const elementRef = useTemplateRef<HTMLSpanElement>("elementRef");
  const currentValue = ref(getInitialValue());
  const isInView = ref(false);
  const hasStarted = ref(false);
  const animationId = ref<number | null>(null);
  const delayTimeoutId = ref<number | null>(null);

  let intersectionObserver: IntersectionObserver | null = null;
  let velocity = 0;
  let startTime = 0;

  const normalizedDuration = computed(() => Math.max(0.01, props.duration));
  const damping = computed(() => 20 + 40 * (1 / normalizedDuration.value));
  const stiffness = computed(() => 100 * (1 / normalizedDuration.value));

  watch(
    [() => props.from, () => props.to, () => props.direction],
    () => {
      void restartAnimationFromCurrentProps();
    },
    { immediate: true },
  );

  watch(
    () => props.startWhen,
    () => {
      startAnimation();
    },
  );

  onMounted(() => {
    updateDisplay();
    setupIntersectionObserver();
  });

  onUnmounted(() => {
    cleanup();
  });

  async function restartAnimationFromCurrentProps(): Promise<void> {
    cleanupAnimation();
    currentValue.value = getInitialValue();
    updateDisplay();
    hasStarted.value = false;

    await nextTick();
    startAnimation();
  }

  function getInitialValue(): number {
    return props.direction === "down" ? props.to : props.from;
  }

  function getTargetValue(): number {
    return props.direction === "down" ? props.from : props.to;
  }

  function formatNumber(value: number): string {
    const formattedNumber = Intl.NumberFormat("en-US", {
      useGrouping: !!props.separator,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value.toFixed(0)));

    return props.separator ? formattedNumber.replace(/,/g, props.separator) : formattedNumber;
  }

  function updateDisplay(): void {
    if (!elementRef.value) {
      return;
    }

    elementRef.value.textContent = formatNumber(currentValue.value);
  }

  function startAnimation(): void {
    if (hasStarted.value || !isInView.value || !props.startWhen) {
      return;
    }

    hasStarted.value = true;
    props.onStart?.();

    if (shouldReduceMotion()) {
      currentValue.value = getTargetValue();
      updateDisplay();
      props.onEnd?.();
      return;
    }

    delayTimeoutId.value = window.setTimeout(() => {
      startTime = 0;
      velocity = 0;
      animationId.value = window.requestAnimationFrame(springAnimation);
    }, props.delay * 1000);
  }

  function springAnimation(timestamp: number): void {
    if (!startTime) {
      startTime = timestamp;
    }

    const target = getTargetValue();
    const displacement = target - currentValue.value;
    const springForce = displacement * stiffness.value;
    const dampingForce = velocity * damping.value;
    const acceleration = springForce - dampingForce;

    velocity += acceleration * 0.016;
    currentValue.value += velocity * 0.016;
    updateDisplay();

    if (Math.abs(displacement) > 0.01 || Math.abs(velocity) > 0.01) {
      animationId.value = window.requestAnimationFrame(springAnimation);
      return;
    }

    currentValue.value = target;
    updateDisplay();
    animationId.value = null;
    props.onEnd?.();
  }

  function setupIntersectionObserver(): void {
    if (!elementRef.value) {
      return;
    }

    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView.value) {
          isInView.value = true;
          startAnimation();
        }
      },
      {
        threshold: 0,
        rootMargin: "0px",
      },
    );

    intersectionObserver.observe(elementRef.value);
  }

  function cleanupAnimation(): void {
    if (animationId.value !== null) {
      window.cancelAnimationFrame(animationId.value);
      animationId.value = null;
    }

    if (delayTimeoutId.value !== null) {
      window.clearTimeout(delayTimeoutId.value);
      delayTimeoutId.value = null;
    }
  }

  function cleanup(): void {
    cleanupAnimation();

    if (intersectionObserver) {
      intersectionObserver.disconnect();
      intersectionObserver = null;
    }
  }

  function shouldReduceMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
</script>

<template>
  <span ref="elementRef" :class="className"></span>
</template>
