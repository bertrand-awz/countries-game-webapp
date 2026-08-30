import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import { createPinia, setActivePinia } from "pinia";

import { useNotificationStore } from "@/application/stores/notificationStore.ts";

function wait(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, durationMs);
  });
}

describe("notificationStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("removes notifications automatically after their duration", async () => {
    const store = useNotificationStore();

    store.add({
      id: "notification-1",
      title: "Game finished",
      durationMs: 5,
    });

    assert.equal(store.notifications.length, 1);

    await wait(15);

    assert.equal(store.notifications.length, 0);
  });

  it("can clear pending notifications and their timers", async () => {
    const store = useNotificationStore();

    store.add({
      id: "notification-1",
      title: "Game finished",
      durationMs: 5,
    });

    store.clear();

    await wait(15);

    assert.equal(store.notifications.length, 0);
  });

  it("replaces an existing notification when a stable id is reused", () => {
    const store = useNotificationStore();

    store.add({
      id: "current-turn",
      title: "Alice is playing",
      durationMs: 0,
    });
    store.add({
      id: "current-turn",
      title: "Bob is playing",
      durationMs: 0,
    });

    assert.equal(store.notifications.length, 1);
    assert.equal(store.notifications[0].title, "Bob is playing");
  });
});
